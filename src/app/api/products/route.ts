import { NextResponse } from "next/server";
import { listProducts } from "@/lib/store";
import { getActiveProducts } from "@/lib/products";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({
      products: products.filter((p) => p.status === "active"),
    });
  } catch {
    return NextResponse.json({ products: getActiveProducts() });
  }
}
