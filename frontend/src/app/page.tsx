import { About } from "@/components/home/About";
import { Boutique } from "@/components/home/Boutique";
import { Categories } from "@/components/home/Categories";
import { Certificate } from "@/components/home/Certificate";
import { Collections } from "@/components/home/Collections";
import { Designers } from "@/components/home/Designers";
import { Feedback } from "@/components/home/Feedback";
import { FooterServer } from "@/components/home/FooterServer";
import { HeaderServer } from "@/components/home/HeaderServer";
import { Hero } from "@/components/home/Hero";
import { News } from "@/components/home/News";
import { getHomePage, getHomeNews } from "@/lib/queries/home";
import { getCategories, getProducts } from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import { mapMedia, mapMediaOrPlaceholder, mapMediaArray, formatPrice } from "@/lib/mappers";

export default async function Home() {
  type StrapiObject = Record<string, unknown>;
  const homeData = await withFallback(async () => {
    const res = await getHomePage();
    return res.data;
  }, null);

  const heroSlides = (homeData?.heroSlides as StrapiObject[] | undefined)?.map(
    (s: StrapiObject, i: number) => ({
      id: i,
      title: s.title as string,
      subtitle: s.subtitle as string,
      action: s.action as string,
      desktopImage: mapMediaOrPlaceholder(s.desktopImage as never),
      mobileImage: mapMediaOrPlaceholder(s.mobileImage as never),
    })
  );

  const feedbackItems = (homeData?.feedbacks as StrapiObject[] | undefined)?.map(
    (f: StrapiObject) => ({
      id: f.id as number,
      name: f.name as string,
      city: f.city as string,
      text: f.text as string,
      avatar: f.avatar ? mapMedia(f.avatar as never) : undefined,
    })
  );

  const advantageItems = (homeData?.advantages as StrapiObject[] | undefined)?.map(
    (a: StrapiObject) => ({
      id: a.id as number,
      title: a.title as string,
    })
  );

  const budgetItems = (homeData?.budgetCollections as StrapiObject[] | undefined)?.map(
    (b: StrapiObject) => ({
      id: b.id as number,
      title: b.title as string,
      price: b.price as string,
      image: mapMediaOrPlaceholder(b.image as never),
    })
  );

  const advImages = homeData?.advantageImages
    ? mapMediaArray(homeData.advantageImages as never)
    : undefined;

  const certificateProps = homeData
    ? {
        title: (homeData.certificateTitle as string) || undefined,
        text: (homeData.certificateText as string) || undefined,
        image: mapMediaOrPlaceholder(homeData.certificateImage as never),
        buttonLabel: (homeData.certificateButtonLabel as string) || undefined,
      }
    : {};

  const designersProps = homeData
    ? {
        title: (homeData.partnershipTitle as string) || undefined,
        text: (homeData.partnershipText as string) || undefined,
        image: mapMediaOrPlaceholder(homeData.partnershipImage as never),
        buttonLabel: (homeData.partnershipButtonLabel as string) || undefined,
      }
    : {};

  const boutiqueProps = homeData
    ? {
        title: (homeData.boutiqueTitle as string) || undefined,
        photos: homeData.boutiquePhotos
          ? mapMediaArray(homeData.boutiquePhotos as never)
          : undefined,
      }
    : {};

  const categoriesData = await withFallback(async () => {
    const res = await getCategories();
    return res.data?.map((c: Record<string, unknown>) => ({
      id: c.documentId as string,
      title: c.title as string,
      count: (c.count as number) || 0,
      image: mapMediaOrPlaceholder(c.image as never),
      isWide: c.slug === "bed-linen",
    }));
  }, undefined);

  const newsData = await withFallback(async () => {
    const res = await getHomeNews();
    return res.data?.map((a: Record<string, unknown>) => ({
      id: a.documentId as string,
      label: (a.category as string) || undefined,
      date: a.date as string,
      title: a.title as string,
      text: (a.excerpt as string) || "",
      image: mapMediaOrPlaceholder(a.image as never),
    }));
  }, undefined);

  const hitProducts = await withFallback(async () => {
    const prods = homeData?.hitProducts as Record<string, unknown>[] | undefined;
    if (prods?.length) {
      return prods.map((p) => ({
        id: p.documentId as string,
        title: p.title as string,
        description: (p.description as string) || "",
        price: formatPrice(p.price as number),
        oldPrice: p.oldPrice ? formatPrice(p.oldPrice as number) : undefined,
        image: mapMediaOrPlaceholder(p.image as never),
        badge: (p.badge as string) || undefined,
      }));
    }
    const res = await getProducts({ pageSize: 6 });
    return res.data?.map((p: Record<string, unknown>) => ({
      id: p.documentId as string,
      title: p.title as string,
      description: (p.description as string) || "",
      price: formatPrice(p.price as number),
      oldPrice: p.oldPrice ? formatPrice(p.oldPrice as number) : undefined,
      image: mapMediaOrPlaceholder(p.image as never),
      badge: (p.badge as string) || undefined,
    }));
  }, undefined);

  const featuredProduct = homeData?.featuredProduct
    ? (() => {
        const fp = homeData.featuredProduct as Record<string, unknown>;
        return {
          title: fp.title as string,
          description: (fp.description as string) || "",
          price: formatPrice(fp.price as number),
          image: mapMediaOrPlaceholder(fp.image as never),
          badge: (fp.badge as string) || undefined,
        };
      })()
    : undefined;

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer />
      <main>
        <Hero slides={heroSlides} />
        <Categories items={categoriesData} />
        <Collections
          hits={hitProducts}
          featuredProduct={featuredProduct}
          advantages={advantageItems}
          advantageImages={advImages}
          budgetCollections={budgetItems}
        />
        <About image={advImages?.[0]} />
        <Feedback items={feedbackItems} />
        <Certificate {...certificateProps} />
        <Designers {...designersProps} />
        <Boutique {...boutiqueProps} />
        <News items={newsData} />
      </main>
      <FooterServer />
    </div>
  );
}
