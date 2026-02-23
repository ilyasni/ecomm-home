"use client";

import { useState } from "react";
import { Modal } from "@/design-system/components/Modal";
import { Input, Button, Radio, Checkbox } from "@/design-system";
import { PhoneInput } from "@/design-system/components/PhoneInput";

type EntityType = "individual" | "legal";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
  onSubmit?: (data: Record<string, string>) => void;
}

export function RegisterModal({
  open,
  onClose,
  onSwitchToLogin,
  onSubmit,
}: RegisterModalProps) {
  const [entityType, setEntityType] = useState<EntityType>("individual");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [inn, setInn] = useState("");
  const [bik, setBik] = useState("");
  const [account, setAccount] = useState("");

  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [loyaltyChecked, setLoyaltyChecked] = useState(false);

  const isIndividual = entityType === "individual";

  const commonFieldsFilled =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    password.trim() !== "";

  const legalFieldsFilled =
    companyName.trim() !== "" &&
    inn.trim() !== "" &&
    bik.trim() !== "" &&
    account.trim() !== "";

  const isFormValid =
    commonFieldsFilled &&
    privacyChecked &&
    (isIndividual || legalFieldsFilled);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const data: Record<string, string> = {
      entityType,
      firstName,
      lastName,
      birthDate,
      phone,
      email,
      password,
    };

    if (!isIndividual) {
      data.companyName = companyName;
      data.inn = inn;
      data.bik = bik;
      data.account = account;
    }

    onSubmit?.(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Заголовок */}
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-medium leading-[1.1] text-[var(--foreground)]">
            Зарегистрируйтесь на сайте
          </h2>
          <p className="text-sm leading-[1.3] text-[var(--color-dark)]">
            Чтобы получить скидку на первую покупку 5%
            <br />и накопить бонусные баллы
          </p>
        </div>

        {/* Радио-переключатель */}
        <div className="flex items-center justify-between">
          <Radio
            name="entityType"
            value="individual"
            checked={isIndividual}
            onChange={() => setEntityType("individual")}
            label="физическое лицо"
          />
          <Radio
            name="entityType"
            value="legal"
            checked={!isIndividual}
            onChange={() => setEntityType("legal")}
            label="юридическое лицо"
          />
        </div>

        {/* Поля формы */}
        <div className="flex flex-col gap-2">
          <Input
            placeholder="Имя*"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            fullWidth
          />
          <Input
            placeholder="Фамилия*"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            fullWidth
          />

          {!isIndividual && (
            <>
              <Input
                placeholder="Наименование компании*"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                fullWidth
              />
              <Input
                placeholder="ИНН*"
                value={inn}
                onChange={(e) => setInn(e.target.value)}
                fullWidth
              />
              <Input
                placeholder="БИК*"
                value={bik}
                onChange={(e) => setBik(e.target.value)}
                fullWidth
              />
              <Input
                placeholder="Расчетный счет*"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                fullWidth
              />
            </>
          )}

          <div className="flex flex-col gap-1">
            <Input
              label="Дата рождения*"
              placeholder="ДД.ММ.ГГГГ"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              fullWidth
            />
          </div>

          <PhoneInput
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />

          <Input
            placeholder="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <Input
            placeholder="Пароль*"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </div>

        {/* Чекбоксы */}
        <div className="flex flex-col gap-4">
          <Checkbox
            checked={privacyChecked}
            onChange={setPrivacyChecked}
            label="Я соглашаюсь на обработку персональных данных в соответствии с политикой конфиденциальности"
          />
          <Checkbox
            checked={loyaltyChecked}
            onChange={setLoyaltyChecked}
            label="Я ознакомлен с программой лояльности"
          />
        </div>

        {/* Кнопки */}
        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!isFormValid}
          >
            Создать учетную запись в кабинете
          </Button>

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="flex h-12 w-full items-center justify-center border-t border-[var(--color-gray-light)] text-base leading-[1.3] text-[var(--color-brand)]"
          >
            Войти на сайте
          </button>
        </div>
      </form>
    </Modal>
  );
}
