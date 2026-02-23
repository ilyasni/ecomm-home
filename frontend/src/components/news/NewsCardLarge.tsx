import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/data/news";

type NewsCardLargeProps = {
  item: NewsItem;
  className?: string;
};

export function NewsCardLarge({ item, className }: NewsCardLargeProps) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className={`group flex flex-col ${className || ""}`}
    >
      <div className="relative w-full h-[200px] md:h-[300px] desktop:h-[461px] overflow-hidden">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-[14px] font-normal leading-[1.3] uppercase text-[var(--color-brand)]">
          {item.category}
        </span>
        <div className="flex flex-col gap-2">
          <h3 className="text-[20px] md:text-[24px] font-medium leading-[1.1] text-[var(--color-black)]">
            {item.title}
          </h3>
          <p className="text-[16px] font-normal leading-[1.3] text-[var(--color-dark)] line-clamp-2">
            {item.excerpt}
          </p>
        </div>
        <span className="text-[14px] font-normal leading-[1.3] text-[var(--color-gray)]">
          {item.date}
        </span>
      </div>
    </Link>
  );
}
