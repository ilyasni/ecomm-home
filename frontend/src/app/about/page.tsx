import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { SectionAdvantages } from "@/components/shared/SectionAdvantages";
import {
  AboutHero,
  AboutIntro,
  AboutHistory,
  AboutCollections,
  AboutProduction,
  AboutCreating,
} from "@/components/about";
import { aboutAdvantages, aboutAdvantageImages } from "@/data/about";
import { getAboutPage } from "@/lib/queries/content-pages";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "О бренде",
  description: "Vita Brava Home — история бренда, философия и производство премиального текстиля.",
};

export default async function AboutPage() {
  const strapiData = await withFallback(async () => {
    const res = await getAboutPage();
    return res.data;
  }, null);

  const resolveImagePosition = (value: "left" | "right" | null | undefined): "left" | "right" => {
    return value === "right" ? "right" : "left";
  };

  const heroProps = strapiData
    ? {
        title: strapiData.heroTitle ?? undefined,
        desktopImage: mapMediaOrPlaceholder(strapiData.heroDesktopImage),
        mobileImage: mapMediaOrPlaceholder(strapiData.heroMobileImage),
      }
    : {};

  const introProps = strapiData
    ? {
        text: strapiData.introText ?? undefined,
        buttonLabel: strapiData.introButtonLabel ?? undefined,
      }
    : {};

  const advantages = strapiData
    ? (strapiData.advantages?.map((advantage) => ({
        id: String(advantage.id),
        title: advantage.title ?? "",
      })) ?? aboutAdvantages)
    : aboutAdvantages;

  const advantageImages = strapiData
    ? (strapiData.advantageImages?.map((image) => mapMediaOrPlaceholder(image)) ??
      aboutAdvantageImages)
    : aboutAdvantageImages;

  const historyProps = strapiData
    ? {
        history: {
          title: strapiData.historyTitle ?? "",
          paragraphs: strapiData.historyParagraphs ?? [],
        },
        differenceData: {
          title: strapiData.differenceTitle ?? "",
          items:
            strapiData.differenceItems?.map((item) => ({
              id: String(item.id),
              title: item.title ?? "",
              subtitle: item.subtitle ?? "",
              image: mapMediaOrPlaceholder(item.image),
            })) ?? [],
        },
      }
    : {};

  const collectionsProps = strapiData
    ? {
        data: {
          title: strapiData.collectionsTitle ?? "",
          subtitle: strapiData.collectionsSubtitle ?? "",
          items:
            strapiData.collectionPreviews?.map((item) => ({
              id: String(item.id),
              title: item.title ?? "",
              image: mapMediaOrPlaceholder(item.image),
            })) ?? [],
        },
      }
    : {};

  const productionProps = strapiData
    ? {
        data: {
          title: strapiData.productionTitle ?? "",
          steps:
            strapiData.productionSteps?.map((step) => ({
              id: String(step.id),
              icon: mapMediaOrPlaceholder(step.icon),
              title: step.title ?? "",
              description: step.description ?? "",
            })) ?? [],
        },
      }
    : {};

  const creatingProps = strapiData
    ? {
        data: {
          title: strapiData.creatingTitle ?? "",
          blocks:
            strapiData.creatingBlocks?.map((block) => ({
              id: String(block.id),
              text: block.text ?? "",
              image: mapMediaOrPlaceholder(block.image),
              imagePosition: resolveImagePosition(block.imagePosition),
            })) ?? [],
        },
      }
    : {};

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer />
      <main>
        <AboutHero {...heroProps} />
        <AboutIntro {...introProps} />

        <SectionAdvantages
          advantages={advantages}
          images={advantageImages}
          className="desktop:px-0 mx-auto max-w-[1400px] px-4 md:px-[39px]"
        />

        <AboutHistory {...historyProps} />
        <AboutCollections {...collectionsProps} />
        <AboutProduction {...productionProps} />
        <AboutCreating {...creatingProps} />
      </main>
      <FooterServer />
    </div>
  );
}
