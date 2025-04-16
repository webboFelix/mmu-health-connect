import { NextResponse } from "next/server";
import prisma from "@/lib/client"; // or wherever your prisma client is

//to test the db connection
export async function GET() {
  try {
    await prisma.$connect();
    return NextResponse.json({ message: "Connected to DB!" });
  } catch (err) {
    console.error("DB Connection Error:", err);
    return NextResponse.json(
      { error: "Failed to connect to DB \n check you DB" },
      { status: 500 }
    );
  }
}
