import { db } from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allUsers = await db.query.users.findMany({
      columns: {
        passwordHash: false, // Exclude password hash from the result
      },
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
