// pages/api/comments.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const postId = req.query.postId as string;
    if (!postId) return res.status(400).json({ error: "postId is required" });

    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      include: { user: true },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}
