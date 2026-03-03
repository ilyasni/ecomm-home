"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/design-system/icons";

type ProductGalleryProps = {
  images: string[];
  title: string;
  onFavorite?: () => void;
  className?: string;
};

export function ProductGallery({ images, title, onFavorite, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex] || images[0];
  const smallImages = images.slice(1, 9);

  const pairs: string[][] = [];
  for (let i = 0; i < smallImages.length; i += 2) {
    pairs.push(smallImages.slice(i, i + 2));
  }

  return (
    <div className={`${className || ""}`}>
      <div className="relative aspect-square w-full overflow-hidden">
        <Image src={mainImage} alt={title} fill className="object-cover" unoptimized />
        <div className="desktop:right-4 desktop:top-4 absolute top-3 right-3 flex gap-2">
          <button
            type="button"
            onClick={onFavorite}
            className="group flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--color-brown)]"
            aria-label="Добавить в избранное"
          >
            <span className="group-hover:hidden">
              <Icon name="favorite" size={18} />
            </span>
            <span className="hidden group-hover:block">
              <Icon name="favoriteFilled" size={18} />
            </span>
          </button>
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[var(--color-brown)] transition-opacity hover:opacity-80"
            aria-label="Сертификат качества"
          >
            <Icon name="diamond" size={18} />
          </button>
        </div>
      </div>

      {pairs.length > 0 && (
        <div className="desktop:mt-2 desktop:gap-2 mt-2 flex flex-col gap-2 md:mt-1 md:gap-1">
          {pairs.map((pair, pairIdx) => (
            <div key={pairIdx} className="desktop:gap-2 grid grid-cols-2 gap-2 md:gap-1">
              {pair.map((img, imgIdx) => {
                const globalIdx = 1 + pairIdx * 2 + imgIdx;
                return (
                  <button
                    key={globalIdx}
                    type="button"
                    onClick={() => setActiveIndex(globalIdx)}
                    className={`relative aspect-square overflow-hidden transition-opacity ${
                      globalIdx === activeIndex
                        ? "ring-2 ring-[var(--color-brown)]"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${title} - фото ${globalIdx + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
