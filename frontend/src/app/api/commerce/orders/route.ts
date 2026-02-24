import { NextResponse } from "next/server";
import { strapiPost } from "@/lib/strapi";

interface CreateOrderPayload {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  paymentMethod: string;
  deliveryMethod: string;
  total: string;
  items: Array<{
    id: string;
    title: string;
    price: string;
    quantity: number;
    image: string;
  }>;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateOrderPayload;
    const totalNumber = Number(payload.total.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
    const orderNumber = `${Date.now()}`;

    const response = await strapiPost<{ data: { documentId?: string } }>("/orders", {
      data: {
        orderNumber,
        status: "processing",
        customerName: payload.customerName,
        email: payload.email,
        phone: payload.phone,
        deliveryAddress: payload.deliveryAddress,
        paymentMethod: payload.paymentMethod,
        deliveryMethod: payload.deliveryMethod,
        total: totalNumber,
        items: payload.items,
      },
    });

    return NextResponse.json({
      id: response.data?.documentId ?? orderNumber,
      orderNumber,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Order creation failed" },
      { status: 500 }
    );
  }
}
