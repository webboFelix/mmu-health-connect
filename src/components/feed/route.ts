import { NextResponse } from "next/server";
import prisma from "@/lib/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const postId = Number(searchParams.get("postId"));

  if (!postId)
    return NextResponse.json({ error: "Post ID is required" }, { status: 400 });

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
  });

  return NextResponse.json(comments);
}
