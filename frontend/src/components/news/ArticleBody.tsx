import Image from "next/image";
import type { ArticleSection } from "@/data/news";

type ArticleBodyProps = {
  sections: ArticleSection[];
  className?: string;
};

function SectionHeading({ section }: { section: ArticleSection }) {
  return (
    <h2
      id={section.id}
      className="text-[18px] desktop:text-[26px] font-medium leading-[1.1] text-[var(--color-black)] pt-6 scroll-mt-32"
    >
      {section.content}
    </h2>
  );
}

function SectionText({ section }: { section: ArticleSection }) {
  return (
    <p className="text-[14px] desktop:text-[16px] font-normal leading-[1.5] text-[var(--color-dark)]">
      {section.content}
    </p>
  );
}

function SectionList({ section }: { section: ArticleSection }) {
  if (!section.items) return null;
  return (
    <ul className="flex flex-col gap-1 pl-5 list-disc">
      {section.items.map((item, i) => (
        <li
          key={i}
          className="text-[14px] desktop:text-[16px] font-normal leading-[1.5] text-[var(--color-dark)]"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function SectionImages({ section }: { section: ArticleSection }) {
  if (!section.images) return null;
  return (
    <div className="flex gap-2 overflow-x-auto">
      {section.images.map((img, i) => (
        <div
          key={i}
          className="relative shrink-0 w-[95px] h-[82px] md:w-[200px] md:h-[140px] desktop:w-auto desktop:h-[280px] desktop:flex-1 overflow-hidden rounded-[5px]"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

function SectionTable({ section }: { section: ArticleSection }) {
  if (!section.headers || !section.rows) return null;
  return (
    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
      <table className="w-full border-collapse text-[14px] desktop:text-[16px] leading-[1.5]">
        <thead>
          <tr>
            {section.headers.map((header, i) => (
              <th
                key={i}
                className="text-left font-medium text-[var(--color-black)] py-3 px-4 border-b border-[var(--color-gray-light)] whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row, ri) => (
            <tr key={ri}>
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className="py-3 px-4 border-b border-[var(--color-gray-light)] text-[var(--color-dark)] whitespace-nowrap first:whitespace-normal"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleBody({ sections, className }: ArticleBodyProps) {
  return (
    <div className={`flex flex-col gap-4 ${className || ""}`}>
      {sections.map((section, index) => {
        switch (section.type) {
          case "heading":
            return <SectionHeading key={index} section={section} />;
          case "text":
            return <SectionText key={index} section={section} />;
          case "list":
            return <SectionList key={index} section={section} />;
          case "images":
            return <SectionImages key={index} section={section} />;
          case "table":
            return <SectionTable key={index} section={section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
