"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Input, Radio, Button } from "@/design-system";
import { PhoneInput } from "@/design-system/components/PhoneInput";

type ProfileData = {
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  company_name: string | null;
};

export function ProfileForm() {
  const [entityType, setEntityType] = useState<"individual" | "legal">("individual");
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
    companyName: "",
    inn: "",
    bik: "",
    account: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/account/profile")
      .then((res) => res.json())
      .then((data: { user?: ProfileData }) => {
        if (data.user) {
          const u = data.user;
          setFormData((prev) => ({
            ...prev,
            firstName: u.first_name ?? "",
            lastName: u.last_name ?? "",
            phone: u.phone ?? "",
            email: u.email,
            companyName: u.company_name ?? "",
          }));
          if (u.company_name) setEntityType("legal");
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim()) {
      toast.error("Заполните обязательные поля");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName || undefined,
          phone: formData.phone || undefined,
          company_name:
            entityType === "legal" && formData.companyName ? formData.companyName : undefined,
        }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("Изменения сохранены");
    } catch {
      toast.error("Не удалось сохранить изменения. Попробуйте позже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-medium text-[var(--color-black)]">Профиль</h2>
        <p className="mt-4 text-sm leading-[1.5] text-[var(--color-dark-gray)]">
          Вы в любой момент можете обновить вашу учетную запись и внести изменения в приведенные
          ниже данные.
        </p>
        <p className="mt-2 text-sm leading-[1.5] text-[var(--color-brand)] underline">
          Зарегистрируйтесь, если хотите получить скидку на первую покупку 5% и накопить бонусные
          баллы
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-[var(--color-gray)]">Загрузка...</p>
      ) : (
        <div className="flex max-w-[394px] flex-col gap-6">
          <div className="flex gap-6">
            <Radio
              name="entityType"
              value="individual"
              checked={entityType === "individual"}
              onChange={() => setEntityType("individual")}
              label="физическое лицо"
            />
            <Radio
              name="entityType"
              value="legal"
              checked={entityType === "legal"}
              onChange={() => setEntityType("legal")}
              label="юридическое лицо"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Input
              placeholder="Ваше Имя*"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              fullWidth
            />
            <Input
              placeholder="Фамилия*"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              fullWidth
            />
            <div className="rounded-[5px] border border-[var(--color-gray-light)] px-3 py-3">
              <span className="text-sm text-[var(--color-gray)]">Дата рождения</span>
              <input
                type="text"
                value={formData.birthDate}
                onChange={handleChange("birthDate")}
                placeholder="ДД.ММ.ГГГГ"
                className="mt-1 block w-full bg-transparent text-base text-[var(--color-dark-gray)] outline-none"
              />
            </div>
            <PhoneInput
              placeholder="+7 999 999 99 99*"
              value={formData.phone}
              onChange={handleChange("phone")}
              fullWidth
            />
            <Input
              placeholder="Mail@mail.ru"
              value={formData.email}
              onChange={handleChange("email")}
              fullWidth
            />
            <Input
              type="password"
              placeholder="Пароль*"
              value={formData.password}
              onChange={handleChange("password")}
              fullWidth
            />

            {entityType === "legal" && (
              <>
                <Input
                  placeholder="Название компании*"
                  value={formData.companyName}
                  onChange={handleChange("companyName")}
                  fullWidth
                />
                <Input
                  placeholder="ИНН*"
                  value={formData.inn}
                  onChange={handleChange("inn")}
                  fullWidth
                />
                <Input
                  placeholder="БИК*"
                  value={formData.bik}
                  onChange={handleChange("bik")}
                  fullWidth
                />
                <Input
                  placeholder="Расчетный счет*"
                  value={formData.account}
                  onChange={handleChange("account")}
                  fullWidth
                />
              </>
            )}
          </div>

          <Button
            variant="primary"
            className="self-start"
            onClick={handleSave}
            isLoading={isSubmitting}
          >
            Сохранить изменения
          </Button>
        </div>
      )}
    </div>
  );
}
