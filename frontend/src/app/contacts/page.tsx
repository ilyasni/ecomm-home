"use client";

import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { ContactInfo, BoutiqueCards, ContactForm } from "@/components/contacts";

const breadcrumbs = [
  { label: "Главная", href: "/" },
  { label: "Контакты" },
];

export default function ContactsPage() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <Header variant="solid" />
      <main className="pt-[78px] md:pt-[81px] desktop:pt-[111px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-6 md:mt-8">
          <h1 className="text-center text-[26px] md:text-[32px] desktop:text-[40px] font-medium leading-[1.1]">
            Контакты для связи
          </h1>
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-8 desktop:mt-10">
          <ContactInfo />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-12 desktop:mt-16">
          <BoutiqueCards />
        </div>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 mt-12 desktop:mt-16 mb-16 desktop:mb-20">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
