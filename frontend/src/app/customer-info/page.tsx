"use client";

import { useState } from "react";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { InfoSidebar, InfoContent } from "@/components/customer-info";
import { infoCategories } from "@/data/customer-info";

export default function CustomerInfoPage() {
  const [activeCategory, setActiveCategory] = useState(infoCategories[0].id);
  const category = infoCategories.find((c) => c.id === activeCategory) ?? infoCategories[0];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6 md:mt-8">
          <h1 className="text-center text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
            Информация для покупателя
          </h1>
        </div>

        <div className="mx-auto max-w-[1400px] px-0 md:px-[39px] desktop:px-0 mt-6 md:mt-8 mb-16 desktop:mb-20">
          {/* Mobile tabs */}
          <div className="desktop:hidden mb-6 px-4 md:px-0">
            <InfoSidebar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          <div className="flex gap-6 desktop:gap-8 px-4 md:px-0">
            {/* Desktop sidebar */}
            <div className="hidden desktop:block">
              <InfoSidebar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            <InfoContent category={category} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
