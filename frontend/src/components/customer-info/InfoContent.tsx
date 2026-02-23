"use client";

import { useState } from "react";
import type { InfoCategory } from "@/data/customer-info";
import { InfoCard } from "./InfoCard";

type InfoContentProps = {
  category: InfoCategory;
};

export function InfoContent({ category }: InfoContentProps) {
  const [activeTab, setActiveTab] = useState(category.tabs?.[0]?.id ?? "");

  return (
    <div className="flex-1 border border-[var(--color-gray-light)] rounded-[5px] p-6 desktop:p-8">
      <h2 className="text-[22px] md:text-[26px] desktop:text-[28px] font-medium leading-[1.1]">
        {category.title}
      </h2>

      {category.tabs && category.tabs.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <div className="flex gap-4 min-w-max border-b border-[var(--color-gray-light)]">
            {category.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm leading-[1.3] transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-[var(--color-brand)] font-medium text-[var(--color-foreground)]"
                    : "text-[var(--color-dark)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {category.cards.map((card) => (
          <InfoCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
