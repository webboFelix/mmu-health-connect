import { EventForm } from "@/components/events/Event";
import EventsPage from "@/components/events/ShowEvents";
import React from "react";

const page = () => {
  return (
    <div>
      <div className="flex justify-center items-center">
        <EventForm />
      </div>
      <div>
        <EventsPage />
      </div>
    </div>
  );
};

export default page;
