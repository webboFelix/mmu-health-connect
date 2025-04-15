"use client";

import { addComment } from "@/lib/actions";
import { useUser } from "@clerk/nextjs";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import { useOptimistic, useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";

type CommentWithUser = Comment & { user: User };

type CommentListProps = { postId: number };

const CommentList = ({ postId }: CommentListProps) => {
  const { user } = useUser();
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comments?postId=${postId}`);
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  const [optimisticComments, addOptimisticComment] = useOptimistic(
    comments,
    (state, value: CommentWithUser) => [value, ...state]
  );

  const handleAddComment = async () => {
    if (!user || !desc.trim()) return;

    const optimisticComment: CommentWithUser = {
      id: Math.random(),
      desc,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user.id,
      postId,
      user: {
        id: user.id,
        username: "Sending...",
        avatar: user.imageUrl || "/noAvatar.png",
        cover: "",
        description: "",
        name: "",
        surname: "",
        city: "",
        work: "",
        school: "",
        website: "",
        createdAt: new Date(),
      },
    };

    addOptimisticComment(optimisticComment);
    setDesc("");

    try {
      const createdComment = await addComment(postId, desc);
      setComments((prev) => [createdComment, ...prev]);
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  return (
    <>
      {/* COMMENT INPUT */}
      {user && (
        <div className="flex items-center gap-4">
          <Image
            src={user.imageUrl || "/noAvatar.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
          <form
            action={handleAddComment}
            className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2 w-full"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              className="bg-transparent outline-none flex-1"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <Image
              src="/emoji.png"
              alt="Emoji Icon"
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </form>
        </div>
      )}

      {/* COMMENTS LIST */}
      <div>
        {loading ? (
          <div className="flex justify-center mt-4">
            <Spinner
              classNames={{ label: "text-foreground mt-4" }}
              label="Loading..."
              variant="spinner"
            />
          </div>
        ) : optimisticComments.length > 0 ? (
          optimisticComments.map((comment) => (
            <div className="flex gap-4 justify-between mt-6" key={comment.id}>
              <Image
                src={comment.user.avatar || "noAvatar.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col gap-2 flex-1">
                <span className="font-medium">
                  {comment.user.name && comment.user.surname
                    ? `${comment.user.name} ${comment.user.surname}`
                    : comment.user.username}
                </span>
                <p>{comment.desc}</p>
                <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">
                  <div className="flex items-center gap-4">
                    <Image
                      src="/like.png"
                      alt="Like"
                      width={12}
                      height={12}
                      className="cursor-pointer w-4 h-4"
                    />
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-500">0 Likes</span>
                  </div>
                  <div>Reply</div>
                </div>
              </div>
              <Image
                src="/more.png"
                alt="More"
                width={16}
                height={16}
                className="cursor-pointer w-4 h-4"
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4 text-center">No comments yet.</p>
        )}
      </div>
    </>
  );
};

export default CommentList;
