"use client";

// import { useEffect, useState } from "react";
// import { EventTypes } from "@/types/event.type";
// import { axiosInstance } from "@/lib/api/api";
import EventCard from "@/components/event-components/event-card";

export default function EventsList() {
//   const [events, setEvents] = useState<EventTypes[]>([]);

//   const fetchEvents = async () => {
//     try {
//       const eventResponse = await axiosInstance.get<EventTypes[]>("/events");
//       setEvents(eventResponse.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      
    </div>
  );
}
