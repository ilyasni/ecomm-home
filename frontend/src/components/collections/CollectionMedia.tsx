"use client";

import Image from "next/image";

type CollectionMediaProps = {
  image: string;
  video: string;
};

export function CollectionMedia({ image, video }: CollectionMediaProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] desktop:h-[688px] overflow-hidden">
          <Image
            src={image}
            alt="Коллекция — изображение"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:h-[500px] desktop:h-[688px] overflow-hidden">
          <Image
            src={video}
            alt="Коллекция — видео"
            fill
            className="object-cover"
            unoptimized
          />
          <button
            type="button"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors"
            aria-label="Воспроизвести видео"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28A1 1 0 008 5.14z" fill="var(--color-foreground)" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
