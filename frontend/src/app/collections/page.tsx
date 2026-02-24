import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { getCollections } from "@/lib/queries/collections";
import { withFallback } from "@/lib/with-fallback";
import { mapMediaOrPlaceholder } from "@/lib/mappers";

export const metadata: Metadata = {
  title: "Коллекции",
  description: "Коллекции Vita Brava Home",
};

export default async function CollectionsPage() {
  const collections = await withFallback(async () => {
    const response = await getCollections();
    return response.data as Record<string, unknown>[];
  }, []);

  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <HeaderServer variant="solid" />
      <main className="pt-[111px] md:pt-[143px]">
        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          <h1 className="mb-6 text-center text-[28px] leading-[1.2] font-medium md:mb-8 md:text-[36px]">
            Коллекции
          </h1>
          <div className="desktop:grid-cols-3 grid grid-cols-1 gap-6 md:grid-cols-2">
            {collections.map((collection) => (
              <Link
                key={(collection.documentId as string) ?? String(collection.id)}
                href={`/collections/${collection.slug as string}`}
                className="group rounded-[5px] border border-[var(--color-gray-light)] p-4"
              >
                <Image
                  src={mapMediaOrPlaceholder(collection.image as never)}
                  alt={String(collection.title ?? "Коллекция")}
                  width={440}
                  height={240}
                  className="h-[240px] w-full rounded-[5px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  unoptimized
                />
                <h2 className="mt-4 text-[20px] font-medium">{String(collection.title ?? "")}</h2>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <FooterServer />
    </div>
  );
}
