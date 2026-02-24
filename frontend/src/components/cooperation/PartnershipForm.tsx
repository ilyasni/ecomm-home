"use client";

import { useState } from "react";
import Image from "next/image";
import { Input, PhoneInput, Checkbox, Button } from "@/design-system/components";
import { partnershipForm as defaultPartnershipForm } from "@/data/cooperation";

interface PartnershipFormProps {
  title?: string;
  subtitle?: string;
  image?: string;
}

export function PartnershipForm(props: PartnershipFormProps) {
  const partnershipForm = {
    title: props.title ?? defaultPartnershipForm.title,
    subtitle: props.subtitle ?? defaultPartnershipForm.subtitle,
    image: props.image ?? defaultPartnershipForm.image,
  };
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);

  return (
    <section className="desktop:px-0 desktop:py-[80px] mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <div className="flex flex-col gap-0 overflow-hidden md:flex-row">
        <div className="relative h-[300px] md:h-auto md:w-1/2">
          <Image
            src={partnershipForm.image}
            alt="Программа партнёрства"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="desktop:p-12 bg-[var(--color-selection)] p-6 md:w-1/2 md:p-8">
          <h2 className="desktop:text-[32px] text-[22px] leading-[1.1] font-medium md:text-[26px]">
            {partnershipForm.title}
          </h2>
          <p className="desktop:text-base mt-4 text-sm leading-[1.5] text-[var(--color-dark)]">
            {partnershipForm.subtitle}
          </p>
          <form className="desktop:mt-8 mt-6 flex flex-col gap-4">
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
