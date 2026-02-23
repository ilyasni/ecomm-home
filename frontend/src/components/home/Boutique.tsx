"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLink, Button, Input, Checkbox } from "@/design-system/components";
import { Icon } from "@/design-system/icons";

export function Boutique() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyChecked, setPrivacyChecked] = useState(false);

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 md:px-[39px] desktop:px-0 desktop:py-0">
      <div className="flex flex-col gap-8 md:gap-10 desktop:flex-row desktop:items-center desktop:gap-[48px] desktop:h-[591px]">
        <div className="flex gap-2 md:h-[343px] desktop:w-[700px] desktop:shrink-0 desktop:h-[591px]">
          <div className="relative h-[289px] w-1/2 desktop:h-[591px] desktop:w-[346px]">
            <Image
              src="/assets/figma/boutique/boutique-1.jpg"
              alt="Бутик VITA BRAVA HOME"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[rgba(33,33,31,0.3)]" />
          </div>
          <div className="relative h-[289px] w-1/2 desktop:h-[591px] desktop:w-[346px]">
            <Image
              src="/assets/figma/boutique/boutique-1.jpg"
              alt="Бутик VITA BRAVA HOME"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-[rgba(33,33,31,0.3)]" />
            <div className="absolute left-1/2 top-1/2 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
              <Icon name="play" size={20} className="rotate-90" />
            </div>
          </div>
        </div>
        <div className="flex flex-col desktop:w-[620px]">
          <div className="flex flex-col gap-6 text-center desktop:text-center">
            <h2 className="text-[26px] font-medium leading-[1.1] desktop:text-[40px]">
              Посетите бутик
              <br />
              VITA BRAVA HOME
            </h2>
            <div className="flex justify-center">
              <ArrowLink label="Как нас найти" tone="dark" />
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-8 text-center desktop:text-center">
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-medium leading-[1.1] desktop:text-[24px]">
                Записаться на консультацию
              </h3>
              <p className="text-sm text-[var(--color-dark)] leading-[1.3] desktop:text-base">
                Оцените качество наших тканей в фирменном магазине в Москве
              </p>
            </div>
            <form className="flex flex-col gap-4 mx-auto desktop:w-[478px]">
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Имя"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
                />
                <Input
                  placeholder="Телефон"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                />
              </div>
              <Checkbox
                label="Я ознакомлен с политикой конфиденциальности"
                checked={privacyChecked}
                onChange={setPrivacyChecked}
                className="text-sm text-[var(--color-dark)]"
              />
              <Button variant="primary" type="submit" fullWidth>
                Оставить заявку
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
