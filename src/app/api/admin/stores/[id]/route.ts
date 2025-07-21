import { db } from "@/db";
import { stores } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateStoreSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  ownerId: z.number().int().positive("A valid owner ID is required").optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = parseInt(params.id, 10);
    if (isNaN(storeId)) {
      return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
    }

    const store = await db.query.stores.findFirst({
      where: eq(stores.id, storeId),
    });

    if (!store) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error(`Error fetching store ${params.id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = parseInt(params.id, 10);
    if (isNaN(storeId)) {
      return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
    }

    const body = await request.json();
    const validation = updateStoreSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const updatedStore = await db
      .update(stores)
      .set(validation.data)
      .where(eq(stores.id, storeId))
      .returning();

    if (updatedStore.length === 0) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json(updatedStore[0]);
  } catch (error) {
    console.error(`Error updating store ${params.id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const storeId = parseInt(params.id, 10);
    if (isNaN(storeId)) {
      return NextResponse.json({ message: "Invalid store ID" }, { status: 400 });
    }

    const deletedStore = await db
      .delete(stores)
      .where(eq(stores.id, storeId))
      .returning();

    if (deletedStore.length === 0) {
      return NextResponse.json({ message: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error(`Error deleting store ${params.id}:`, error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
