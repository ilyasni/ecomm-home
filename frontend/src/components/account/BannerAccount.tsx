import Link from "next/link";
import Image from "next/image";
import { Button } from "@/design-system";

export function BannerAccount() {
  return (
    <div className="flex flex-col items-stretch overflow-hidden rounded-[5px] border border-[var(--color-gray-light)] md:flex-row">
      <div className="relative flex h-[140px] w-full items-center justify-center bg-[var(--color-selection)] md:h-[171px] md:w-[242px]">
        <Image
          src="/assets/figma/placeholder.svg"
          alt="Сертификат"
          fill
          unoptimized
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 items-center justify-between gap-4 bg-[var(--color-dark)] px-6 py-4 text-[var(--color-light)] md:py-0">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-medium md:text-2xl">Подарок, который ждут!</span>
          <span className="text-sm text-[var(--color-gray-light)]">
            сертификат от VITA BRAVA HOME
          </span>
        </div>
        <Link href="/catalog">
          <Button
            variant="secondary"
            size="small"
            className="shrink-0 border-[var(--color-light)] text-[var(--color-light)] hover:bg-[var(--color-light)] hover:text-[var(--color-dark)]"
          >
            Выбрать
          </Button>
        </Link>
      </div>
    </div>
  );
}
