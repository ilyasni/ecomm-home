"use client";

import React, { useState } from "react";
import { Input, PhoneInput, Checkbox } from "@/design-system/components";

interface ClientDataFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isLegalEntity: boolean;
  companyName: string;
  inn: string;
  kpp: string;
  onChange: (field: string, value: string | boolean) => void;
}

export function ClientDataForm({
  firstName,
  lastName,
  phone,
  email,
  isLegalEntity,
  companyName,
  inn,
  kpp,
  onChange,
}: ClientDataFormProps) {
  const [entityType, setEntityType] = useState<"individual" | "legal">(
    isLegalEntity ? "legal" : "individual"
  );

  const handleEntityToggle = (checked: boolean) => {
    setEntityType(checked ? "legal" : "individual");
    onChange("isLegalEntity", checked);
  };

  return (
    <section className="border border-[var(--color-gray-light)] rounded-[5px] p-3 md:p-6">
      <h3 className="text-[18px] md:text-[20px] font-medium mb-4 md:mb-6">
        Информация о получателе
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Имя"
            value={firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            placeholder="Введите имя"
            fullWidth
          />
          <Input
            label="Фамилия"
            value={lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            placeholder="Введите фамилию"
            fullWidth
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PhoneInput
            label="Телефон"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange("phone", e.target.value)
            }
            fullWidth
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="example@mail.ru"
            fullWidth
          />
        </div>

        <div className="pt-2">
          <Checkbox
            checked={entityType === "legal"}
            onChange={handleEntityToggle}
            label="Юридическое лицо"
          />
        </div>

        {entityType === "legal" && (
          <div className="space-y-4 pt-2 border-t border-[var(--color-gray-light)]">
            <h4 className="text-[16px] font-medium pt-4">Реквизиты организации</h4>
            <Input
              label="Название организации"
              value={companyName}
              onChange={(e) => onChange("companyName", e.target.value)}
              placeholder="ООО «Компания»"
              fullWidth
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ИНН"
                value={inn}
                onChange={(e) => onChange("inn", e.target.value)}
                placeholder="1234567890"
                fullWidth
              />
              <Input
                label="КПП"
                value={kpp}
                onChange={(e) => onChange("kpp", e.target.value)}
                placeholder="123456789"
                fullWidth
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
