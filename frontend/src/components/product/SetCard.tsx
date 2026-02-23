"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Select } from "@/design-system/components";
import type { SetItem } from "@/data/sets";

type SetCardProps = {
  item: SetItem;
  onAddToCart?: (id: string, size: string) => void;
  className?: string;
};

export function SetCard({ item, onAddToCart, className }: SetCardProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    onAddToCart?.(item.id, selectedSize);
  };

  return (
    <div className={`flex gap-4 desktop:gap-6 ${className || ""}`}>
      <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] desktop:w-[134px] desktop:h-[134px] shrink-0 overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-4 desktop:gap-6">
        <div className="flex flex-col gap-3 pt-1">
          <h3 className="text-[18px] desktop:text-[24px] font-medium leading-[1.1]">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-[14px] leading-[1.3] text-[var(--color-dark)]">
              {item.subtitle}
            </p>
          )}
          <div className="flex items-center gap-4">
            <span className="text-[18px] desktop:text-[24px] font-medium leading-[1.1]">
              {item.price}
            </span>
            {item.oldPrice && (
              <span className="text-[16px] desktop:text-[20px] font-medium leading-normal text-[var(--color-brown)] line-through">
                {item.oldPrice}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Select
            options={item.sizes}
            placeholder="Размер"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            fullWidth
          />
          {addedToCart ? (
            <Button variant="primary" fullWidth>
              Перейти в корзину
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={handleAddToCart}>
              В корзину
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
