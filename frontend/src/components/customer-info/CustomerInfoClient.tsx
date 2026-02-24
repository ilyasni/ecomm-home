"use client";

import { useState } from "react";
import { infoCategories as defaultInfoCategories } from "@/data/customer-info";
import type { InfoCategory } from "@/data/customer-info";
import { InfoSidebar } from "./InfoSidebar";
import { InfoContent } from "./InfoContent";

type CustomerInfoClientProps = {
  categories?: InfoCategory[];
};

export function CustomerInfoClient({ categories }: CustomerInfoClientProps) {
  const data = categories ?? defaultInfoCategories;
  const [activeCategory, setActiveCategory] = useState(data[0].id);
  const category = data.find((c) => c.id === activeCategory) ?? data[0];

  return (
    <div className="desktop:px-0 desktop:mb-20 mx-auto mt-6 mb-16 max-w-[1400px] px-0 md:mt-8 md:px-[39px]">
      <div className="desktop:hidden mb-6 px-4 md:px-0">
        <InfoSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={data}
        />
      </div>

      <div className="desktop:gap-8 flex gap-6 px-4 md:px-0">
        <div className="desktop:block hidden">
          <InfoSidebar
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            categories={data}
          />
        </div>

        <InfoContent category={category} />
      </div>
    </div>
  );
}
