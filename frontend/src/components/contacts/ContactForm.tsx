"use client";

import { useState } from "react";
import {
  Input,
  PhoneInput,
  Textarea,
  Checkbox,
  Button,
} from "@/design-system/components";

export function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);

  return (
    <div className="border border-[var(--color-gray-light)] rounded-[5px] p-6 md:p-8 desktop:p-10">
      <div className="flex flex-col desktop:flex-row desktop:gap-16">
        <div className="desktop:w-[340px] shrink-0">
          <h3 className="text-lg font-medium leading-[1.1] desktop:text-xl">
            Не нашли ответ на свой вопрос?
          </h3>
          <p className="mt-4 text-sm text-[var(--color-dark)] leading-[1.5]">
            Заполните форму для обратной связи и мы вам перезвоним!
          </p>
        </div>

        <form className="mt-6 desktop:mt-0 flex-1 flex flex-col gap-4">
          <Input
            placeholder="Имя*"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <PhoneInput value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Textarea
            placeholder="Ваше обращение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={160}
          />
          <Checkbox
            label="Я соглашаюсь на обработку персональных данных в соответствии с политикой конфиденциальности"
            checked={privacyChecked}
            onChange={setPrivacyChecked}
          />
          <Button variant="primary" type="submit" fullWidth>
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
}
