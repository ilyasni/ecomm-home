import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/data/news";

type NewsCardSmallProps = {
  item: NewsItem;
  className?: string;
};

export function NewsCardSmall({ item, className }: NewsCardSmallProps) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className={`group flex gap-4 items-center ${className || ""}`}
    >
      <div className="relative shrink-0 w-[120px] h-[107px] desktop:w-[166px] desktop:h-[148px] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0 justify-center">
        <span className="text-[14px] font-normal leading-[1.3] uppercase text-[var(--color-brand)]">
          {item.category}
        </span>
        <h3 className="text-[16px] desktop:text-[18px] font-medium leading-[1.1] text-[var(--color-black)] line-clamp-2">
          {item.title}
        </h3>
        <span className="text-[14px] font-normal leading-[1.3] text-[var(--color-gray)]">
          {item.date}
        </span>
      </div>
    </Link>
  );
}
