import { auth } from "@clerk/nextjs/server";
import Post from "./Post";
import prisma from "@/lib/client";

const Feed = async ({ username }: { username?: string }) => {
  const { userId } = await auth(); // ✅ Fetch userId on the server

  let posts: any[] = [];

  if (username) {
    posts = await prisma.post.findMany({
      where: { user: { username } },
      include: {
        user: true,
        likes: { select: { userId: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (userId) {
    const following = await prisma.follower.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    //const followingIds = following.map((f) => f.followingId);
    //const ids = [userId, ...followingIds];

    posts = await prisma.post.findMany({
      include: {
        user: true,
        likes: { select: { userId: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12 overflow-y-auto h-screen">
      {posts.length
        ? posts.map((post) => (
            <Post key={post.id} post={post} userId={userId} />
          )) // ✅ Pass userId to Post.tsx
        : "No posts found!"}
    </div>
  );
};

export default Feed;
