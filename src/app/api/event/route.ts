// /pages/api/event/deleteEvent.ts
import { NextApiRequest, NextApiResponse } from "next";
import { deleteEvent } from "@/lib/actions"; // Ensure this function exists and works as expected

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required" });
    }

    try {
      await deleteEvent(eventId); // Delete the event with this ID
      return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      return res.status(500).json({ error: "Failed to delete event" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
