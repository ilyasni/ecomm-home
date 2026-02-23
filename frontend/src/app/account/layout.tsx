import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { AccountSidebar } from "@/components/account";
import { AccountTabs } from "@/components/account";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <h1 className="text-center text-[28px] md:text-[36px] font-medium leading-[1.2] text-[var(--color-black)] py-6 md:py-8">
          Личный кабинет
        </h1>

        <div className="mx-auto max-w-[1400px] px-4 md:px-[39px] desktop:px-0 pb-12 md:pb-20">
          {/* Mobile tabs */}
          <AccountTabs />

          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-2 md:gap-2">
            <AccountSidebar />

            <div className="min-w-0 flex-1">
              {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
