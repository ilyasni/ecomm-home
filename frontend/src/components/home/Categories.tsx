"use client";

import Image from "next/image";
import Link from "next/link";
import { categories as defaultCategories } from "@/data/home";

interface CategoryData {
  id: string | number;
  title: string;
  count: number;
  image: string;
  href?: string;
  isWide?: boolean;
}

interface CategoriesProps {
  items?: CategoryData[];
}

export function Categories({ items }: CategoriesProps = {}) {
  const categories = items?.length ? items : defaultCategories;
  const fallbackHrefById: Record<string, string> = {
    "bed-linen": "/catalog/bed-linen",
    bed: "/catalog/bed-linen",
    blankets: "/catalog/blankets",
    blanket: "/catalog/blankets",
    pillows: "/catalog/pillows",
    throws: "/catalog/throws",
    plaids: "/catalog/throws",
    home: "/catalog/home",
    "home-textile": "/catalog/home",
    towels: "/catalog/towels",
    boudoir: "/catalog/boudoir",
  };

  return (
    <section className="desktop:px-0 desktop:py-[80px] relative mx-auto max-w-[1400px] px-4 py-10 md:px-[39px]">
      <Image
        src="/assets/figma/categories/hand.png"
        alt=""
        width={400}
        height={500}
        className="desktop:block desktop:w-[400px] pointer-events-none absolute -right-4 bottom-0 z-10 hidden w-[280px]"
        unoptimized
        aria-hidden="true"
      />
      <div className="desktop:gap-2 grid grid-cols-2 gap-1 md:grid-cols-4 md:gap-1">
        {categories.map((item, index) => {
          const isWide = item.isWide && index === 0;
          return (
            <Link
              href={item.href ?? fallbackHrefById[String(item.id)] ?? "/catalog"}
              className={`relative overflow-hidden ${isWide ? "col-span-2" : ""} desktop:h-[440px] h-[217px] md:h-[232px]`}
              key={item.id}
            >
              <Image src={item.image} alt={item.title} fill className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(0,0,0,0.2)]" />
              <div className="absolute bottom-4 left-4 flex items-end gap-2 text-[var(--color-light)]">
                <span className="desktop:text-2xl text-lg leading-[1.1] font-medium">
                  {item.title}
                </span>
                <span className="desktop:text-sm pb-4 text-xs leading-[1.3] text-[#D9D5D0]">
                  ({item.count})
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
