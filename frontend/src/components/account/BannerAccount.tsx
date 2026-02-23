import Link from "next/link";
import { Button } from "@/design-system";

export function BannerAccount() {
  return (
    <div className="flex flex-col md:flex-row items-stretch rounded-[5px] overflow-hidden border border-[var(--color-gray-light)]">
      <div className="w-full md:w-[242px] h-[140px] md:h-[171px] bg-[var(--color-selection)] flex items-center justify-center">
        <img
          src="/assets/figma/collections/featured.jpg"
          alt="Сертификат"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-between gap-4 px-6 py-4 md:py-0 bg-[var(--color-dark)] text-[var(--color-light)]">
        <div className="flex flex-col gap-1">
          <span className="text-xl md:text-2xl font-medium">
            Подарок, который ждут!
          </span>
          <span className="text-sm text-[var(--color-gray-light)]">
            сертификат от VITA BRAVA HOME
          </span>
        </div>
        <Link href="/catalog">
          <Button variant="secondary" size="small" className="shrink-0 border-[var(--color-light)] text-[var(--color-light)] hover:bg-[var(--color-light)] hover:text-[var(--color-dark)]">
            Выбрать
          </Button>
        </Link>
      </div>
    </div>
  );
}
