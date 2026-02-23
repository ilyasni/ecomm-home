import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CategoriesGrid } from "@/components/catalog/CategoriesGrid";
import { CatalogBanner } from "@/components/catalog/CatalogBanner";

export default function CatalogCategoriesPage() {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог" },
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="px-4 md:px-[39px] desktop:px-0">
          <div className="mx-auto max-w-[1400px] pt-4 desktop:pt-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        </div>
        <CategoriesGrid />
        <CatalogBanner className="mt-12 desktop:mt-[80px]" />
      </main>
      <Footer />
    </div>
  );
}
