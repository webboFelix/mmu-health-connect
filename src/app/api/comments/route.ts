// app/api/comments/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      include: { user: true },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
