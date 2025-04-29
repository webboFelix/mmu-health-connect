import AddPost from "@/components/AddPost";
//import Stories from "@/components/Stories";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";
import { auth } from "@clerk/nextjs/server";
//import { User } from "@prisma/client";
import prisma from "@/lib/client";

const Homepage = async () => {
  const { userId: currentUserId } = await auth();

  if (!currentUserId) return null;

  const user = await prisma.user.findUnique({
    where: { id: currentUserId }, // ✅ use `id` since it's the primary key in your model
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        {/**The Left Menu */}
        <LeftMenu type="home" />
      </div>
      {/**The Middle Feed */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col mb-5 gap-6">
          {/**<Stories /> */}
          {user?.work == "Doctor" && <AddPost />}
          <Feed />
        </div>
      </div>
      {/**The right Menu */}
      <div className="hidden lg:block w-[30%]">
        <RightMenu />
      </div>
    </div>
  );
};

export default Homepage;
