"use client";

import { Modal } from "@/design-system/components/Modal";
import { Button } from "@/design-system";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
  onGuest: () => void;
}

export function AuthPromptModal({
  open,
  onClose,
  onLogin,
  onGuest,
}: AuthPromptModalProps) {
  return (
    <Modal open={open} onClose={onClose} variant="right">
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-medium leading-[1.1] text-[var(--foreground)]">
            Покупайте со скидкой
          </h2>
          <p className="max-w-[394px] text-base leading-[1.3] text-[var(--color-dark)]">
            Зарегистрируйтесь, чтобы получить скидку
            <br />
            на первую покупку 5% и накопить бонусы
          </p>
        </div>

        <div className="flex w-full max-w-[394px] flex-col gap-2">
          <Button variant="primary" fullWidth onClick={onLogin}>
            Войти/Зарегистрироваться
          </Button>
          <Button variant="secondary" fullWidth onClick={onGuest}>
            Оформить заказ как гость
          </Button>
        </div>

        <p className="text-xs leading-[1.1] text-[var(--color-dark)]">
          Бонусные баллы не будут начисляться
        </p>
      </div>
    </Modal>
  );
}
