import { OrdersList } from "@/components/account/OrdersList";

export default function OrdersPage() {
  return (
    <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
      <OrdersList />
    </div>
  );
}
