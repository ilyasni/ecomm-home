"use client";

import { useState } from "react";
import { Modal, SearchInput } from "@/design-system/components";
import { Icon } from "@/design-system/icons";
import { boutiques } from "@/data/account";

interface BoutiquePickupModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (boutiqueId: string) => void;
}

export function BoutiquePickupModal({
  open,
  onClose,
  onSelect,
}: BoutiquePickupModalProps) {
  const [search, setSearch] = useState("");

  const filtered = boutiques.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase()) ||
      b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal open={open} onClose={onClose} variant="right">
      <div className="p-4 md:p-6">
        <h2 className="text-[18px] md:text-[22px] font-medium mb-4">
          Самовывоз из бутика
        </h2>

        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Поиск бутика"
          fullWidth
          className="mb-4"
        />

        <div className="space-y-0">
          {filtered.map((boutique) => (
            <button
              key={boutique.id}
              type="button"
              onClick={() => onSelect(boutique.id)}
              className="w-full text-left py-4 border-b border-[var(--color-gray-light)] hover:bg-[var(--color-beige)] transition-colors px-2 -mx-2 rounded"
            >
              <p className="text-[14px] font-medium">{boutique.name}</p>
              <p className="text-[13px] text-[var(--color-dark)] mt-1">{boutique.address}</p>
              <div className="flex items-center gap-4 mt-2 text-[12px] text-[var(--color-dark)]">
                <span className="flex items-center gap-1">
                  <Icon name="phone" size={12} />
                  {boutique.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="clock" size={12} />
                  {boutique.workingHours}
                </span>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="text-[14px] text-[var(--color-dark)] text-center py-8">
              Бутики не найдены
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
