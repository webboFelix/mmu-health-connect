import prisma from "@/lib/client";
import Comments from "./Comments";

const Comm = async ({ postId }: { postId: number }) => {
  // Fetch comments from the database
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
  });
  console.log("comments", comments);
  // Pass the fetched comments as props to the Comments component
  return <Comments comments={comments} postId={postId} />;
};

export default Comm;
