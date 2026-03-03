import { NextResponse } from "next/server";
import { createCdekOrder, type CdekOrderItem } from "@/lib/cdek";

interface DeliveryOrderBody {
  orderId?: string;
  toAddress?: string;
  toCityId?: string;
  customerName?: string;
  phone?: string;
  items?: CdekOrderItem[];
}

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as DeliveryOrderBody;
  const {
    orderId = "",
    toAddress = "",
    toCityId = "msk",
    customerName = "",
    phone = "",
    items = [],
  } = body;

  try {
    const result = await createCdekOrder({
      orderId,
      toAddress,
      toCityId,
      customerName,
      phone,
      items,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[CDEK delivery/order] error:", error);
    return NextResponse.json(
      { cdekUuid: null, status: "error", error: "CDEK unavailable" },
      { status: 502 }
    );
  }
}
