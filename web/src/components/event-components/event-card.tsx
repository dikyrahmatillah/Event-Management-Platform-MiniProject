"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HiMapPin } from "react-icons/hi2";
import { EventTypes } from "@/types/event.type"; // Adjust the path based on your types folder structure

interface EventCardProps {
  event: EventTypes;
}

export default function EventCard({ event }: EventCardProps) {
  // // Helper function to format date
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  //   const day = date.getDate().toString().padStart(2, '0');
  //   const year = date.getFullYear().toString();
  //   return { month, day, year };
  // };

  // // Helper function to format time
  // const formatTime = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleTimeString('en-US', {
  //     hour: 'numeric',
  //     minute: '2-digit',
  //     hour12: true
  //   });
  // };

  // const formattedDate = formatDate(event.startDate);
  // const formattedTime = formatTime(event.startDate);
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/events`);
        console.log(res);
        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        setEvents(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  if (!events) return <p>Event not found</p>;
  if (loading) return <p className="text-center">Loading events...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;
  return (
    <Link href={`/event-details/${event.id}`}>
      <div className="flex flex-col flex-grow justify-between w-full lg:w-[480px] h-[640px] bg-[#A2C617] cursor-pointer hover:opacity-90 transition-opacity">
        <div className="flex justify-end w-full">
          <div className="flex flex-col items-center justify-center w-[95px] h-[120px] bg-white">
            <p className="font-mono font-bold text-xl leading-8">
              {event.startDate}
            </p>
            <p className="font-mono font-bold text-4xl leading-8">
              {event.startDate}
            </p>
            <p className="font-mono font-bold text-xl leading-8">
              {event.startDate}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="px-6 gap-4">
            <p className="flex font-mono font-bold text-2xl md:text-3xl lg:text-4xl">
              {event.eventName}
            </p>
          </div>
          <div className="flex align-baseline">
            <div className="flex px-6 pb-8">
              <HiMapPin className="w-[24px] h-[24px]" />
              <p className="flex font-mono font-medium text-[18px] align-baseline">
                {event.location}
              </p>
            </div>
            <div>
              <p className="flex font-mono font-medium text-[14px]">
                {event.endDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
