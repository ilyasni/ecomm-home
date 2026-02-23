"use client";

import { Modal, Button } from "@/design-system/components";

interface CheckoutAuthModalProps {
  open: boolean;
  onClose: () => void;
  onContinueWithout: () => void;
}

export function CheckoutAuthModal({
  open,
  onClose,
  onContinueWithout,
}: CheckoutAuthModalProps) {
  return (
    <Modal open={open} onClose={onClose} variant="right">
      <div className="p-4 md:p-6">
        <h2 className="text-[18px] md:text-[22px] font-medium mb-3">
          Оформление заказа
        </h2>
        <p className="text-[14px] text-[var(--color-dark)] mb-6 leading-[1.5]">
          Зарегистрируйтесь, чтобы получить скидку на первую покупку 5% и накопить бонусные баллы
        </p>

        <div className="space-y-3 mb-4">
          <Button variant="primary" fullWidth onClick={onClose}>
            Войти или зарегистрироваться
          </Button>
          <Button variant="secondary" fullWidth onClick={onContinueWithout}>
            Продолжить без регистрации
          </Button>
        </div>

        <p className="text-[12px] text-[var(--color-dark)] text-center">
          Бонусные баллы не будут начисляться
        </p>
      </div>
    </Modal>
  );
}
