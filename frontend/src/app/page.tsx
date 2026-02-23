import { About } from "@/components/home/About";
import { Boutique } from "@/components/home/Boutique";
import { Categories } from "@/components/home/Categories";
import { Certificate } from "@/components/home/Certificate";
import { Collections } from "@/components/home/Collections";
import { Designers } from "@/components/home/Designers";
import { Feedback } from "@/components/home/Feedback";
import { Footer } from "@/components/home/Footer";
import { Header } from "@/components/home/Header";
import { Hero } from "@/components/home/Hero";
import { News } from "@/components/home/News";

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main>
        <Hero />
        <Categories />
        <Collections />
        <About />
        <Feedback />
        <Certificate />
        <Designers />
        <Boutique />
        <News />
      </main>
      <Footer />
    </div>
  );
}
