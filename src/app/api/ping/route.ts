// app/api/ping/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET() {
  try {
    const result = await prisma.user.findMany({
      take: 1,
    });
    return NextResponse.json({ message: "DB Connected!", user: result });
  } catch (error) {
    console.error("DB Connection Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to DB" },
      { status: 500 }
    );
  }
}
