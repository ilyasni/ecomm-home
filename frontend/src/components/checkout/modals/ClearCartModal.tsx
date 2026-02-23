"use client";

import { Modal, Button } from "@/design-system/components";

interface ClearCartModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ClearCartModal({ open, onClose, onConfirm }: ClearCartModalProps) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 md:p-8 max-w-[520px] mx-auto">
        <h2 className="text-[18px] md:text-[22px] font-medium mb-3">
          Очистить корзину?
        </h2>
        <p className="text-[14px] text-[var(--color-dark)] mb-6 leading-[1.5]">
          Отменить удаление продуктов из корзины будет невозможно
        </p>
        <div className="flex flex-col md:flex-row gap-3">
          <Button variant="primary" fullWidth onClick={onConfirm}>
            Очистить
          </Button>
          <Button variant="secondary" fullWidth onClick={onClose}>
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
}
