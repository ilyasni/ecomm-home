import { BannerAccount } from "@/components/account/BannerAccount";
import { DashboardCards } from "@/components/account/DashboardCards";

export default function AccountDashboardPage() {
  return (
    <div className="flex flex-col gap-6 rounded-[5px] border border-[var(--color-gray-light)] p-6">
      <BannerAccount />
      <DashboardCards />
    </div>
  );
}
