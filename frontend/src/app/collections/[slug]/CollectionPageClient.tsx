"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import {
  CollectionHero,
  CollectionDescription,
  CollectionMedia,
  CollectionProducts,
  CollectionBanner,
} from "@/components/collections";
import type { Collection } from "@/data/collections";

interface CollectionPageClientProps {
  collection: Collection;
}

export function CollectionPageClient({ collection }: CollectionPageClientProps) {
  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: collection.title },
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="desktop:pt-[111px] pt-[78px] md:pt-[81px]">
        <div className="desktop:px-0 mx-auto mt-4 max-w-[1400px] px-4 md:mt-6 md:px-[39px]">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="mt-4 md:mt-6">
          <CollectionHero
            title={collection.heroTitle}
            subtitle={collection.heroSubtitle}
            images={collection.heroImages}
          />
        </div>

        <CollectionDescription
          title={collection.descriptionTitle}
          paragraphs={collection.descriptionParagraphs}
        />

        <CollectionMedia image={collection.mediaImage} video={collection.mediaVideo} />

        <CollectionProducts products={collection.products} />

        <CollectionBanner
          title={collection.bannerTitle}
          description={collection.bannerDescription}
          buttonLabel={collection.bannerButtonLabel}
          image={collection.bannerImage}
        />
      </main>
      <Footer />
    </div>
  );
}
