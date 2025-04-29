"use client";

import Slider from "react-slick";
import { useEffect, useState } from "react";
import { getEvents } from "@/lib/actions";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";

const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const data = await getEvents();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    arrows: false,
  };

  // Helper to format the date nicely
  const formatDate = (isoDate: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(isoDate).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm">
      <div className="flex items-center justify-between text-gray-500 font-medium">
        <span>Upcoming Events</span>
        <Image src="/more.png" alt="more" width={16} height={16} />
      </div>

      <div className="mt-4">
        <Slider {...settings}>
          {events.map((event) => (
            <div key={event.id} className="p-2">
              <div className="flex flex-col gap-4">
                {/* Image */}
                <div
                  className={`relative w-full ${
                    size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"
                  }`}
                >
                  <Image
                    src={event.imageUrl || "/default-ad.jpg"}
                    alt={event.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>

                {/* Name + Small Image */}
                <div className="flex items-center gap-4">
                  <Image
                    src={event.imageUrl || "/default-ad.jpg"}
                    alt={event.name}
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 object-cover"
                  />
                  <span className="text-blue-500 font-medium">
                    {event.name}
                  </span>
                </div>

                {/* NEW - Event Date */}
                <div className="text-gray-400 text-xs">
                  {event.schedule ? formatDate(event.schedule) : "No Date"}
                </div>

                {/* Details */}
                <p className={size === "sm" ? "text-xs" : "text-sm"}>
                  {event.details.length > 100
                    ? event.details.substring(0, 100) + "..."
                    : event.details}
                </p>

                {/* Button */}
                <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">
                  <Link href="/events">More</Link>
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Ad;
