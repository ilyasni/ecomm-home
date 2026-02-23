import type { ArticleTOCItem } from "@/data/news";

type ArticleTOCProps = {
  items: ArticleTOCItem[];
  className?: string;
};

export function ArticleTOC({ items, className }: ArticleTOCProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={`bg-[var(--color-selection)] rounded-[5px] px-4 py-4 desktop:px-6 desktop:py-6 ${className || ""}`}
    >
      <p className="text-[16px] desktop:text-[20px] font-medium leading-[1.3] text-[var(--color-black)] mb-4 desktop:mb-5">
        В этой статье
      </p>
      <ol className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[14px] desktop:text-[16px] leading-[1.3] text-[var(--color-dark)] hover:text-[var(--color-brand)] transition-colors flex gap-2"
            >
              <span className="text-[var(--color-gray)]">{index + 1}.</span>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
