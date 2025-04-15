"use client";

import CommentList from "./CommentList";
import { Comment, User } from "@prisma/client";

type CommentWithUser = Comment & { user: User };

const Comments = ({
  comments,
  postId,
}: {
  comments: CommentWithUser[];
  postId: number;
}) => {
  return (
    <div>
      <CommentList comments={comments} postId={postId} />
    </div>
  );
};

export default Comments;
