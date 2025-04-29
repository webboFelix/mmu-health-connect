"use client";

import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import PostInteraction from "./PostInteraction";
import PostInfo from "./PostInfo";
import Comments from "./Comments";
import { Post as PostType, User, Comment } from "@prisma/client";
import { Separator } from "../ui/separator";

type CommentWithUser = Comment & { user: User };

type FeedPostType = PostType & {
  user: User;
  likes: { userId: string }[];
  _count: { comments: number };
};

const isImage = (url: string) => {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
};

const isVideo = (url: string) => {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
};

const Post = ({
  post,
  userId,
}: {
  post: FeedPostType;
  userId: string | null;
}) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  const toggleComments = async () => {
    setShowComments((prev) => !prev);

    if (!commentsLoaded) {
      try {
        const res = await fetch(`/api/comments?postId=${post.id}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data: CommentWithUser[] = await res.json();
        setComments(data);
        setCommentsLoaded(true);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* USER INFO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={post.user.avatar || "/noAvatar.png"}
            width={40}
            height={40}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? `${post.user.name} ${post.user.surname}`
              : post.user.username}
          </span>
        </div>
        {userId === post.user.id && <PostInfo postId={post.id} />}
      </div>

      {/* POST CONTENT */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="w-full min-h-auto relative rounded-md overflow-hidden">
            {isImage(post.img) ? (
              <img src={post.img} className="object-cover" alt="Post image" />
            ) : isVideo(post.img) ? (
              <video controls className="w-full h-full object-cover">
                <source src={post.img} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <p className="text-sm text-gray-500">Unsupported media type.</p>
            )}
          </div>
        )}
        <p>{post.desc}</p>
      </div>

      {/* POST INTERACTIONS */}
      <Suspense fallback="Loading...">
        <PostInteraction
          postId={post.id}
          likes={post.likes.map((like) => like.userId)}
          commentNumber={post._count.comments}
          toggleComments={toggleComments}
        />
      </Suspense>

      {/* COMMENTS SECTION */}
      {showComments && <Comments comments={comments} postId={post.id} />}

      {/* ADD FANCY CENTER BULGE SEPARATOR */}
      <Separator className="my-6 h-[4px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
    </div>
  );
};

export default Post;
