import { NextResponse } from "next/server";
import { calculateCdekDelivery } from "@/lib/cdek";

interface CalculateBody {
  toCity?: string;
  weight?: number;
}

export async function POST(req: Request): Promise<NextResponse> {
  const body = (await req.json()) as CalculateBody;
  const { toCity = "msk", weight = 1000 } = body;

  try {
    const result = await calculateCdekDelivery(toCity, weight);
    return NextResponse.json(result);
  } catch {
    // Graceful fallback — всегда возвращаем дефолтную цену
    return NextResponse.json({ price: 390, periodMin: 3, periodMax: 5, tariffCode: 136 });
  }
}
