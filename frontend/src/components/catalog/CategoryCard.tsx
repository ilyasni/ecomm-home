import Image from "next/image";
import Link from "next/link";

type CategoryCardProps = {
  title: string;
  count: number;
  image: string;
  href: string;
  className?: string;
};

export function CategoryCard({ title, count, image, href, className }: CategoryCardProps) {
  return (
    <Link href={href} className={`relative block overflow-hidden ${className || ""}`}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.3)]" />

      {/* Desktop: по центру */}
      <div className="absolute inset-0 hidden desktop:flex items-center justify-center">
        <div className="flex items-end gap-2">
          <span className="text-[24px] font-medium leading-[1.1] text-[var(--color-light)]">
            {title}
          </span>
          <span className="pb-[16px] text-[14px] leading-[1.3] text-[var(--color-light)]">
            ({count})
          </span>
        </div>
      </div>

      {/* Mobile + Tablet: внизу слева */}
      <div className="absolute bottom-0 left-0 flex items-end gap-1 px-3 pb-3 desktop:hidden">
        <span className="text-[20px] font-medium leading-[1.1] text-[var(--color-light)]">
          {title}
        </span>
        <span className="pb-[8px] text-[14px] leading-[1.3] text-[var(--color-gray-light)]">
          ({count})
        </span>
      </div>
    </Link>
  );
}
