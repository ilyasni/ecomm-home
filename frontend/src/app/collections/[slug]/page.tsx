"use client";

import { use } from "react";
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
import { getCollectionBySlug } from "@/data/collections";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default function CollectionPage({ params }: PageProps) {
  const { slug } = use(params);
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    return (
      <div className="bg-[var(--background)] text-[var(--foreground)]">
        <Header variant="solid" />
        <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px] min-h-[60vh] flex items-center justify-center">
          <p className="text-lg text-[var(--color-gray)]">
            Коллекция не найдена
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Главная", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: collection.title },
  ];

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-4 md:mt-6">
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

        <CollectionMedia
          image={collection.mediaImage}
          video={collection.mediaVideo}
        />

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
