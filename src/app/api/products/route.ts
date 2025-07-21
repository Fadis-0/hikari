import { db } from "@/db";
import { products } from "@/db/schema";
import { NextResponse } from "next/server";
import { asc, desc, eq, ilike, and, gte, lte } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const sortBy = searchParams.get("sortBy"); // 'price' or 'name'
  const order = searchParams.get("order"); // 'asc' or 'desc'
  const search = searchParams.get("q");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  try {
    const query = db.select().from(products);
    const conditions = [];

    if (storeId) {
      conditions.push(eq(products.storeId, Number(storeId)));
    }

    if (search) {
      conditions.push(ilike(products.name, `%${search}%`));
    }

    if (category && category !== 'All') {
      conditions.push(eq(products.category, category));
    }

    if (minPrice) {
      conditions.push(gte(products.price, minPrice));
    }

    if (maxPrice) {
      conditions.push(lte(products.price, maxPrice));
    }

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    if (sortBy) {
      const sortOrder = order === "desc" ? desc : asc;
      if (sortBy === "price") {
        query.orderBy(sortOrder(products.price));
      } else if (sortBy === "name") {
        query.orderBy(sortOrder(products.name));
      }
    }

    const allProducts = await query;

    const productsWithNumericPrice = allProducts.map(product => ({
      ...product,
      price: parseFloat(product.price),
    }));

    return NextResponse.json(productsWithNumericPrice);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
