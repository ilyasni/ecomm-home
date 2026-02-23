"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Input,
  PhoneInput,
  Checkbox,
  Button,
} from "@/design-system/components";
import { partnershipForm } from "@/data/cooperation";

export function PartnershipForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 py-10 desktop:py-[80px]">
      <div className="flex flex-col md:flex-row gap-0 overflow-hidden">
        <div className="relative h-[300px] md:h-auto md:w-1/2">
          <Image
            src={partnershipForm.image}
            alt="Программа партнёрства"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="bg-[var(--color-selection)] p-6 md:p-8 desktop:p-12 md:w-1/2">
          <h2 className="text-[22px] md:text-[26px] desktop:text-[32px] font-medium leading-[1.1]">
            {partnershipForm.title}
          </h2>
          <p className="mt-4 text-sm text-[var(--color-dark)] leading-[1.5] desktop:text-base">
            {partnershipForm.subtitle}
          </p>
          <form className="mt-6 desktop:mt-8 flex flex-col gap-4">
            <Input
              placeholder="Имя*"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} />
            <Input
              placeholder="E-mail*"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <Input
              placeholder="Город*"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
            />
            <Checkbox
              label="Подтверждаю согласие на обработку персональных данных в соответствии с политикой конфиденциальности"
              checked={privacyChecked}
              onChange={setPrivacyChecked}
            />
            <Button variant="primary" type="submit" fullWidth>
              Отправить заявку на сотрудничество
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
