"use client";

type CatalogHeaderProps = {
  title: string;
  count: number;
  className?: string;
};

export function CatalogHeader({ title, count, className }: CatalogHeaderProps) {
  return (
    <div className={`flex items-baseline gap-2 md:justify-center ${className || ""}`}>
      <h1 className="text-[24px] font-medium leading-tight md:text-[32px] desktop:text-[44px]">
        {title}
      </h1>
      <span className="text-[16px] text-[var(--color-gray)] desktop:text-[27px]">({count})</span>
    </div>
  );
}
