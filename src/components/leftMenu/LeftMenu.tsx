import Link from "next/link";
import Image from "next/image";
import ProfileCard from "./ProfileCard";
//import Ad from "../Ad";

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}
      <div className="p-4 bg-white rounded-lg shadow-md text-sm text-gray-500 flex flex-col gap-2">
        <Link
          href="/events"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/events.png" alt="" width={20} height={20} />
          <span>Events</span>
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="https://mmu-appointment.netlify.app/"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/activity.png" alt="" width={20} height={20} />
          <span>Appointment</span>
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
        <Link
          href="/doctors"
          className="flex items-center gap-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <Image src="/noAvatar.png" alt="" width={20} height={20} />
          <span>Doctors</span>
        </Link>
        <hr className="border-t-1 border-gray-50 w-36 self-center" />
      </div>
      {/**<Ad size="sm" /> */}
    </div>
  );
};

export default LeftMenu;
