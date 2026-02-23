"use client";

import { SetCard } from "@/components/product/SetCard";
import { Button } from "@/design-system/components";
import type { SetItem } from "@/data/sets";

type SetCollectionCardsProps = {
  items: SetItem[];
  onAddToCart?: (id: string, size: string) => void;
  onBuyCollection?: () => void;
  className?: string;
};

export function SetCollectionCards({
  items,
  onAddToCart,
  onBuyCollection,
  className,
}: SetCollectionCardsProps) {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div className="flex flex-col gap-8 desktop:gap-10">
        {items.map((item) => (
          <SetCard key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>

      <div className="mt-8 desktop:mt-10">
        <Button variant="secondary" fullWidth onClick={onBuyCollection}>
          Купить всю коллекцию
        </Button>
      </div>
    </div>
  );
}
