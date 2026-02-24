import { Footer } from "./Footer";
import { getFooter } from "@/lib/queries/navigation";
import { withFallback } from "@/lib/with-fallback";
import type { FooterData } from "@/lib/queries/navigation";

export async function FooterServer() {
  const footer = await withFallback<FooterData | null>(async () => {
    const res = await getFooter();
    return res.data as FooterData;
  }, null);

  return <Footer footer={footer} />;
}
