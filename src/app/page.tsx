import AddPost from "@/components/AddPost";
import Stories from "@/components/Stories";
import Feed from "@/components/feed/Feed";
import LeftMenu from "@/components/leftMenu/LeftMenu";
import RightMenu from "@/components/rightMenu/RightMenu";

const Homepage = () => {
  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        {/**The Left Menu */}
        <LeftMenu type="home" />
      </div>
      {/**The Middle Feed */}
      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <Stories />
          <AddPost />
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
