"use client";

import { useState } from "react";
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
import {
  accountUser,
  type PaymentMethodType,
  type DeliveryMethodType,
  type CheckoutFormData,
} from "@/data/account";
import { createOrder, getCommerceSnapshot } from "@/lib/commerce";

export default function CheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [boutiqueModalOpen, setBoutiqueModalOpen] = useState(false);
  const [cityModalOpen, setCityModalOpen] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: accountUser.firstName,
    lastName: accountUser.lastName,
    phone: accountUser.phone,
    email: accountUser.email,
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

  const [promoStatus, setPromoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [promoMessage, setPromoMessage] = useState("");

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

  const handlePromoApply = () => {
    setPromoStatus("loading");
    setTimeout(() => {
      if (formData.promoCode.toLowerCase() === "vita10") {
        setPromoStatus("success");
        setPromoMessage("Промокод применён: скидка 10%");
      } else {
        setPromoStatus("error");
        setPromoMessage("Промокод не найден");
      }
    }, 1000);
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
    const localOrder = createOrder({
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      deliveryAddress:
        formData.deliveryMethod === "pickup"
          ? `Самовывоз из бутика ${formData.boutiqueId}`
          : formData.deliveryAddress,
      paymentMethod: formData.paymentMethod,
      deliveryMethod: formData.deliveryMethod,
    });
    try {
      const response = await fetch("/api/commerce/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          deliveryAddress:
            formData.deliveryMethod === "pickup"
              ? `Самовывоз из бутика ${formData.boutiqueId}`
              : formData.deliveryAddress,
          paymentMethod: formData.paymentMethod,
          deliveryMethod: formData.deliveryMethod,
          total: localOrder.total,
          items: localOrder.items,
        }),
      });
      const data = (await response.json()) as { id?: string };
      router.push(`/checkout/success?orderId=${data.id ?? localOrder.id}`);
    } catch {
      router.push(`/checkout/success?orderId=${localOrder.id}`);
    }
  };

  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-28 md:px-[39px] md:pb-20">
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
              />

              <ReferralSection
                promoCode={formData.promoCode}
                bonusesToSpend={formData.bonusesToSpend}
                availableBonuses={accountUser.bonuses}
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
              subtotal="64 000 ₽"
              discount="4 000 ₽"
              promoDiscount={promoStatus === "success" ? "6 000 ₽" : undefined}
              bonusDiscount={
                formData.bonusesToSpend > 0 ? `${formData.bonusesToSpend} ₽` : undefined
              }
              deliveryPrice={
                formData.deliveryMethod === "pickup"
                  ? "Бесплатно"
                  : formData.deliveryMethod === "courier"
                    ? "590 ₽"
                    : "390 ₽"
              }
              total="60 400 ₽"
              bonusEarned={3000}
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
