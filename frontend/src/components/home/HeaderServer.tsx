import { Header } from "./Header";
import { getNavigation } from "@/lib/queries/navigation";
import { withFallback } from "@/lib/with-fallback";
import type { NavigationData } from "@/lib/queries/navigation";

type HeaderServerProps = {
  variant?: "transparent" | "solid";
};

export async function HeaderServer({ variant }: HeaderServerProps) {
  const navigation = await withFallback<NavigationData | null>(async () => {
    const res = await getNavigation();
    return res.data as NavigationData;
  }, null);

  return <Header variant={variant} navigation={navigation} />;
}
