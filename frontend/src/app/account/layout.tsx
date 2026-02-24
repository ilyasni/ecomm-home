import { HeaderServer } from "@/components/home/HeaderServer";
import { FooterServer } from "@/components/home/FooterServer";
import { AccountSidebar } from "@/components/account";
import { AccountTabs } from "@/components/account";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME } from "@/lib/auth/server";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    redirect("/");
  }

  return (
    <>
      <HeaderServer variant="solid" />

      <main className="pt-[111px] md:pt-[143px]">
        <h1 className="py-6 text-center text-[28px] leading-[1.2] font-medium text-[var(--color-black)] md:py-8 md:text-[36px]">
          Личный кабинет
        </h1>

        <div className="desktop:px-0 mx-auto max-w-[1400px] px-4 pb-12 md:px-[39px] md:pb-20">
          {/* Mobile tabs */}
          <AccountTabs />

          <div className="mt-4 flex flex-col gap-2 md:mt-0 md:flex-row md:gap-2">
            <AccountSidebar />

            <div className="min-w-0 flex-1">{children}</div>
          </div>
        </div>
      </main>

      <FooterServer />
    </>
  );
}
