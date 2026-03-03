import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CategoriesGrid } from "@/components/catalog/CategoriesGrid";
import { CatalogBanner } from "@/components/catalog/CatalogBanner";
import { getCategories } from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";
import type { CategoryCardData } from "@/data/catalog-categories";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Каталог",
  description:
    "Каталог премиального домашнего текстиля Vita Brava Home — постельное бельё, полотенца, пледы.",
};

export default async function CatalogCategoriesPage() {
  const categoriesData = await withFallback(async () => {
    const res = await getCategories();
    return res.data;
  }, null);

  const categories = categoriesData?.map((c: Record<string, unknown>) => ({
    id: (c as { documentId: string }).documentId,
    title: c.title as string,
    count:
      (c as { productCount?: number; count?: number }).productCount ??
      (c as { count?: number }).count ??
      0,
    image: mapMediaOrPlaceholder(c.image as never),
    href: `/catalog/${c.slug as string}`,
  })) as CategoryCardData[] | undefined;

  const breadcrumbs = [{ label: "Главная", href: "/" }, { label: "Каталог" }];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 px-4 md:px-[39px]">
          <div className="desktop:pt-6 mx-auto max-w-[1400px] pt-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
        <CategoriesGrid categories={categories} />
        <CatalogBanner className="desktop:mt-[80px] mt-12" />
      </main>
      <FooterServer />
    </div>
  );
}
