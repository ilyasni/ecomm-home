"use client";

import { useState } from "react";
import { Modal } from "@/design-system/components/Modal";
import { Input, Button } from "@/design-system";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onSubmit?: (data: { email: string; password: string }) => void;
}

export function LoginModal({
  open,
  onClose,
  onSwitchToRegister,
  onSubmit,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validateEmail = (value: string) => {
    if (!value) return "Введите e-mail";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(value)) return "Введите почту формата mail@example.ru";
    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = password ? undefined : "Введите пароль";
    const newErrors = { email: emailError, password: passwordError };
    setErrors(newErrors);

    if (!emailError && !passwordError) {
      onSubmit?.({ email, password });
    }
  };

  const handleEmailBlur = () => {
    if (email) {
      const err = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: err }));
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <h2 className="text-center text-2xl font-medium leading-[1.1] text-[var(--foreground)]">
          Войти по почте
        </h2>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Ваш e-mail*"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            state={errors.email ? "error" : "default"}
            errorText={errors.email}
            fullWidth
          />
          <Input
            placeholder="Пароль*"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            state={errors.password ? "error" : "default"}
            errorText={errors.password}
            fullWidth
          />
        </div>

        <div className="flex flex-col gap-6">
          <p className="text-center text-sm leading-[1.3] text-[var(--color-gray)]">
            Если вы забыли свой пароль и хотите войти в кабинет, укажите свой
            Email, а пароль оставьте пустым, мы отправим на него ссылку для
            входа
          </p>

          <div className="flex flex-col gap-4">
            <Button type="submit" variant="primary" fullWidth>
              Войти в кабинет
            </Button>

            <button
              type="button"
              onClick={onSwitchToRegister}
              className="flex h-12 w-full items-center justify-center border-t border-[var(--color-gray-light)] text-base leading-[1.3] text-[var(--color-brand)]"
            >
              Регистрация на сайте
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
