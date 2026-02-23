"use client";

import type { InfoSection } from "@/data/info-pages";

type ArticleContentProps = {
  sections: InfoSection[];
};

export function ArticleContent({ sections }: ArticleContentProps) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-lg font-medium leading-[1.1] desktop:text-[20px]">
            {section.title}
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {section.paragraphs.map((p, pIdx) => (
              <p
                key={pIdx}
                className="text-sm leading-[1.5] text-[var(--color-dark)] desktop:text-base"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
