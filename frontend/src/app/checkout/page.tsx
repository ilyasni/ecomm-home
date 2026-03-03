"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Icon } from "@/design-system/icons";
import { ClientDataForm } from "@/components/checkout/ClientDataForm";
import { PaymentSection } from "@/components/checkout/PaymentSection";
import { DeliverySection } from "@/components/checkout/DeliverySection";
import { ReferralSection } from "@/components/checkout/ReferralSection";
import { CommentSection } from "@/components/checkout/CommentSection";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";
import { BoutiquePickupModal } from "@/components/checkout/modals/BoutiquePickupModal";
import { CitySelectionModal } from "@/components/checkout/modals/CitySelectionModal";
import type { PaymentMethodType, DeliveryMethodType, CheckoutFormData } from "@/data/account";
import { getCommerceSnapshot } from "@/lib/commerce";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boutiqueModalOpen, setBoutiqueModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    isLegalEntity: false,
    companyName: "",
    inn: "",
    kpp: "",
    paymentMethod: "card",
    deliveryMethod: "courier",
    deliveryCity: "msk",
    deliveryAddress: "",
    boutiqueId: "",
    promoCode: "",
    bonusesToSpend: 0,
    comment: "",
  });

  // Предзаполнить форму из профиля Medusa (если пользователь залогинен)
  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then(
        (data: {
          user?: {
            first_name: string | null;
            last_name: string | null;
            email: string;
            phone: string | null;
          };
        }) => {
          if (data.user) {
            setFormData((prev) => ({
              ...prev,
              firstName: data.user!.first_name ?? prev.firstName,
              lastName: data.user!.last_name ?? prev.lastName,
              email: data.user!.email || prev.email,
              phone: data.user!.phone ?? prev.phone,
            }));
          }
        }
      )
      .catch(() => {});
  }, []);

  // 3.4.2 — баланс бонусов из Medusa customer.metadata
  const [availableBonuses, setAvailableBonuses] = useState(0);
  useEffect(() => {
    fetch("/api/account/bonuses")
      .then((r) => r.json())
      .then((d: { balance?: number }) => setAvailableBonuses(d.balance ?? 0))
      .catch(() => {});
  }, []);

  const [cdekPrice, setCdekPrice] = useState(390);
  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [promoMessage, setPromoMessage] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: "percentage" | "fixed";
    value: number;
  } | null>(null);

  const items = getCommerceSnapshot().cartItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description ?? "Товар",
    color: item.color ?? "Не указан",
    price: item.price,
    oldPrice: item.oldPrice,
    total: item.price,
    image: item.image,
    quantity: item.quantity,
    bonusReturn: 0,
    isFavorite: Boolean(item.isFavorite),
  }));

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePromoApply = async () => {
    if (!formData.promoCode.trim()) return;
    setPromoStatus("loading");
    try {
      const res = await fetch("/api/cart/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.promoCode }),
      });
      const data = await res.json();
      if (data.valid && data.discount) {
        setAppliedPromo({ code: data.code, type: data.discount.type, value: data.discount.value });
        setPromoStatus("success");
        setPromoMessage(
          `Промокод применён: скидка ${
            data.discount.type === "percentage"
              ? `${data.discount.value}%`
              : `${data.discount.value.toLocaleString("ru-RU")} ₽`
          }`
        );
      } else {
        setAppliedPromo(null);
        setPromoStatus("error");
        setPromoMessage(data.message ?? "Промокод не найден");
      }
    } catch {
      setPromoStatus("error");
      setPromoMessage("Ошибка проверки промокода");
    }
  };

  const canSubmit =
    formData.firstName.trim() !== "" &&
    formData.lastName.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.email.trim() !== "" &&
    (formData.deliveryMethod === "pickup"
      ? formData.boutiqueId !== ""
      : formData.deliveryAddress.trim() !== "");

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);

    const customerName = `${formData.firstName} ${formData.lastName}`.trim();
    const deliveryAddress =
      formData.deliveryMethod === "pickup"
        ? `Самовывоз из бутика ${formData.boutiqueId}`
        : formData.deliveryAddress;

    let orderId: string | null = null;

    // ── Попытка #1: Medusa Cart Complete flow ────────────────────────────
    try {
      // Сначала синхронизируем localStorage items → Medusa cart
      const cartItems = getCommerceSnapshot().cartItems;
      await fetch("/api/cart/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      }).catch((err) => console.warn("[checkout] sync failed (non-blocking):", err));

      await fetch("/api/cart/address", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: deliveryAddress,
          city: "Москва",
          phone: formData.phone,
          country_code: "ru",
        }),
      });

      const completeRes = await fetch("/api/cart/complete", { method: "POST" });
      const completeData = (await completeRes.json()) as {
        type: "order" | "cart";
        order?: { id: string; display_id?: number };
        error?: string;
      };

      if (completeData.type === "order" && completeData.order?.id) {
        orderId = completeData.order.id;
      } else {
        // Нет shipping/payment provider в Medusa — используем legacy fallback
        console.warn(
          "[checkout] Cart complete failed, fallback to Draft Orders:",
          completeData.error
        );
      }
    } catch (err) {
      console.warn("[checkout] Cart complete error, fallback to Draft Orders:", err);
    }

    // Если Cart Complete не вернул orderId — генерируем локальный
    if (!orderId) {
      orderId = `local-${crypto.randomUUID()}`;
    }

    // ── Fire-and-forget: email-подтверждение заказа клиенту ─────────────
    if (formData.email) {
      void fetch("/api/email/order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: formData.email,
          orderId,
          customerName,
          deliveryAddress,
          items: items.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: formatRub(subtotal),
          total: formatRub(totalAmount),
          promoDiscount: promoDiscount > 0 ? formatRub(promoDiscount) : undefined,
          bonusDiscount: bonusDiscount > 0 ? formatRub(bonusDiscount) : undefined,
          deliveryPrice: deliveryCost === 0 ? "Бесплатно" : formatRub(deliveryCost),
        }),
      }).catch(() => {});
    }

    // ── 3.4.2 Fire-and-forget: начислить бонусы (5% от итого) ───────────
    if (orderId) {
      void fetch("/api/account/bonuses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ earnedAmount: bonusEarned }),
      }).catch(() => {});
    }

    // ── Fire-and-forget: CDEK заявка ────────────────────────────────────
    if (formData.deliveryMethod === "cdek" && formData.deliveryAddress) {
      void fetch("/api/delivery/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          toAddress: formData.deliveryAddress,
          toCityId: formData.deliveryCity,
          customerName,
          phone: formData.phone,
          items: items.map((item) => ({ title: item.title, quantity: item.quantity })),
        }),
      }).catch(() => {});
    }

    // ── Онлайн-оплата ────────────────────────────────────────────────────
    const needsOnlinePayment =
      formData.paymentMethod !== "on-delivery" && formData.paymentMethod !== "certificate";

    if (needsOnlinePayment) {
      try {
        const payRes = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            amount: Math.round(totalAmount * 100),
            method: formData.paymentMethod,
            customerEmail: formData.email,
          }),
        });
        const payData = (await payRes.json()) as {
          paymentId?: string;
          confirmationUrl?: string;
        };
        const encodedUrl = encodeURIComponent(payData.confirmationUrl ?? "stub");
        router.push(
          `/checkout/payment?orderId=${encodeURIComponent(orderId)}&paymentId=${encodeURIComponent(payData.paymentId ?? "")}&url=${encodedUrl}&method=${formData.paymentMethod}`
        );
      } catch {
        router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
      }
    } else {
      router.push(`/checkout/success?orderId=${encodeURIComponent(orderId)}`);
    }

    setIsSubmitting(false);
  };

  // ── Расчёт итогов ────────────────────────────────────────────────────────
  function formatRub(value: number): string {
    return `${Math.round(value).toLocaleString("ru-RU")} ₽`;
  }

  const subtotal = items.reduce((sum, item) => {
    const priceNum = Number(item.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  const promoDiscount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? Math.round(subtotal * (appliedPromo.value / 100))
      : Math.min(appliedPromo.value, subtotal)
    : 0;

  const bonusDiscount = Number(formData.bonusesToSpend) || 0;

  const deliveryCost =
    formData.deliveryMethod === "pickup"
      ? 0
      : formData.deliveryMethod === "courier"
        ? 590
        : cdekPrice;

  const totalAmount = subtotal - promoDiscount - bonusDiscount + deliveryCost;
  const bonusEarned = Math.round(totalAmount * 0.05);
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-[200px] md:px-[39px] md:pb-20">
          {/* Заголовок */}
          <h1 className="mb-6 text-center text-[28px] leading-[1.2] font-medium md:mb-8 md:text-[36px]">
            Оформление заказа
          </h1>

          <div className="flex flex-col items-start gap-6 md:flex-row md:gap-8">
            {/* Левая колонка — форма */}
            <div className="min-w-0 flex-1 space-y-4">
              <Link
                href="/cart"
                className="inline-flex items-center gap-2 text-[14px] text-[var(--color-dark)] hover:text-[var(--color-black)]"
              >
                <Icon name="arrowRight" size={14} className="rotate-180" />
                Продолжить покупки
              </Link>

              <ClientDataForm
                firstName={formData.firstName}
                lastName={formData.lastName}
                phone={formData.phone}
                email={formData.email}
                isLegalEntity={formData.isLegalEntity}
                companyName={formData.companyName}
                inn={formData.inn}
                kpp={formData.kpp}
                onChange={updateField}
              />

              <PaymentSection
                selected={formData.paymentMethod}
                onChange={(method: PaymentMethodType) => updateField("paymentMethod", method)}
              />

              <DeliverySection
                selectedMethod={formData.deliveryMethod}
                city={formData.deliveryCity}
                address={formData.deliveryAddress}
                boutiqueId={formData.boutiqueId}
                onMethodChange={(method: DeliveryMethodType) =>
                  updateField("deliveryMethod", method)
                }
                onCityChange={(city) => updateField("deliveryCity", city)}
                onAddressChange={(addr) => updateField("deliveryAddress", addr)}
                onBoutiqueSelect={() => setBoutiqueModalOpen(true)}
                onCdekPriceUpdate={setCdekPrice}
              />

              <ReferralSection
                promoCode={formData.promoCode}
                bonusesToSpend={formData.bonusesToSpend}
                availableBonuses={availableBonuses}
                onPromoChange={(code) => updateField("promoCode", code)}
                onPromoApply={handlePromoApply}
                onBonusesChange={(amount) => updateField("bonusesToSpend", amount.toString())}
                promoStatus={promoStatus}
                promoMessage={promoMessage}
              />

              <CommentSection
                value={formData.comment}
                onChange={(val) => updateField("comment", val)}
              />
            </div>

            {/* Правая колонка — итого */}
            <CheckoutSidebar
              items={items}
              subtotal={formatRub(subtotal)}
              promoDiscount={promoDiscount > 0 ? formatRub(promoDiscount) : undefined}
              bonusDiscount={bonusDiscount > 0 ? formatRub(bonusDiscount) : undefined}
              deliveryPrice={deliveryCost === 0 ? "Бесплатно" : formatRub(deliveryCost)}
              total={formatRub(totalAmount)}
              bonusEarned={bonusEarned}
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>

      <Footer />

      <BoutiquePickupModal
        open={boutiqueModalOpen}
        onClose={() => setBoutiqueModalOpen(false)}
        onSelect={(id) => {
          updateField("boutiqueId", id);
          setBoutiqueModalOpen(false);
        }}
      />

      <CitySelectionModal
        open={cityModalOpen}
        onClose={() => setCityModalOpen(false)}
        onSelect={(cityId) => {
          updateField("deliveryCity", cityId);
          setCityModalOpen(false);
        }}
      />
    </>
  );
}
