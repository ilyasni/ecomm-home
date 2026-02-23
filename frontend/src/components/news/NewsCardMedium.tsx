import Image from "next/image";
import Link from "next/link";
import type { NewsItem } from "@/data/news";

type NewsCardMediumProps = {
  item: NewsItem;
  className?: string;
};

export function NewsCardMedium({ item, className }: NewsCardMediumProps) {
  return (
    <Link
      href={`/news/${item.slug}`}
      className={`group flex flex-col ${className || ""}`}
    >
      <div className="relative w-full aspect-square overflow-hidden">
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
          <h3 className="text-[16px] desktop:text-[24px] font-medium leading-[1.1] text-[var(--color-black)]">
            {item.title}
          </h3>
          <p className="text-[14px] desktop:text-[16px] font-normal leading-[1.3] text-[var(--color-dark)] line-clamp-2">
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
