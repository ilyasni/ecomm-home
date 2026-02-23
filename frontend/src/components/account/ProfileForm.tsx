"use client";

import { useState } from "react";
import { Input, Radio, Button } from "@/design-system";
import { PhoneInput } from "@/design-system/components/PhoneInput";
import { accountUser } from "@/data/account";

export function ProfileForm() {
  const [entityType, setEntityType] = useState<"individual" | "legal">("individual");
  const [formData, setFormData] = useState({
    firstName: accountUser.firstName,
    lastName: accountUser.lastName,
    birthDate: accountUser.birthDate,
    phone: accountUser.phone,
    email: accountUser.email,
    password: "",
    companyName: "",
    inn: "",
    bik: "",
    account: "",
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-medium text-[var(--color-black)]">Профиль</h2>
        <p className="mt-4 text-sm leading-[1.5] text-[var(--color-dark-gray)]">
          Вы в любой момент можете обновить вашу учетную запись и внести изменения
          в приведенные ниже данные.
        </p>
        <p className="mt-2 text-sm leading-[1.5] text-[var(--color-brand)] underline">
          Зарегистрируйтесь, если хотите получить скидку на первую покупку 5% и
          накопить бонусные баллы
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-[394px]">
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
          <div className="border border-[var(--color-gray-light)] rounded-[5px] px-3 py-3">
            <span className="text-sm text-[var(--color-gray)]">Дата рождения</span>
            <input
              type="text"
              value={formData.birthDate}
              onChange={handleChange("birthDate")}
              placeholder="ДД.ММ.ГГГГ"
              className="block w-full text-base text-[var(--color-dark-gray)] bg-transparent outline-none mt-1"
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

        <Button variant="primary" className="self-start">
          Сохранить изменения
        </Button>
      </div>
    </div>
  );
}
