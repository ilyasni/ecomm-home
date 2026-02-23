import { OrderDetail } from "@/components/account/OrderDetail";
import { orders } from "@/data/account";
import { notFound } from "next/navigation";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = orders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return (
    <div className="rounded-[5px] border border-[var(--color-gray-light)] p-6">
      <OrderDetail order={order} />
    </div>
  );
}
