import { Header } from "./Header";
import { getNavigation } from "@/lib/queries/navigation";
import { getCategories } from "@/lib/queries/catalog";
import { withFallback } from "@/lib/with-fallback";
import type { NavigationData } from "@/lib/queries/navigation";
import type { StrapiCategoryRaw } from "@/lib/queries/catalog";

type HeaderServerProps = {
  variant?: "transparent" | "solid";
};

export async function HeaderServer({ variant }: HeaderServerProps) {
  const [navigation, catalogData] = await Promise.all([
    withFallback<NavigationData | null>(async () => {
      const res = await getNavigation();
      return res.data as NavigationData;
    }, null),
    withFallback<StrapiCategoryRaw[] | null>(async () => {
      const res = await getCategories();
      return res.data as unknown as StrapiCategoryRaw[];
    }, null),
  ]);

  return <Header variant={variant} navigation={navigation} catalogData={catalogData} />;
}
