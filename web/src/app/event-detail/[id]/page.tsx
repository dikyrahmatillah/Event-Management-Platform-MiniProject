// pages/event-details/[id].tsx (Pages Router)
// OR app/event-details/[id]/page.tsx (App Router)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // For Pages Router
// import { useParams } from 'next/navigation'; // For App Router
import { EventTypes } from "@/types/event.type";
import Image from "next/image";
import { eventService } from "@/lib/api/event-service";
import {
  HiMapPin,
  HiCalendar,
  HiClock,
  HiTicket,
  HiUsers,
} from "react-icons/hi2";

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = router.query; // For Pages Router
  // const params = useParams(); // For App Router
  // const id = params?.id;

  const [event, setEvent] = useState<EventTypes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const eventData = await eventService.getEventById(
          parseInt(id as string)
        );
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Event not found");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleBookTicket = () => {
    // Implement booking logic
    alert("Booking functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading event details...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">
          {error || "Event not found"}
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  const availabilityPercentage =
    (event.availableSeats / event.totalSeats) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => router.back()}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Image */}
            <div className="lg:col-span-1">
              <Image
                src={event.imageUrl || "/placeholder-event.jpg"}
                alt={event.eventName}
                className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Event Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {event.eventName}
                  </h1>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : event.status === "INACTIVE"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {event.price}
                  </div>
                  <div className="text-sm text-gray-500">per ticket</div>
                </div>
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <HiCalendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {formatDate(event.startDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(event.startDate) !== formatDate(event.endDate)
                        ? `to ${formatDate(event.endDate)}`
                        : "Single day event"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HiClock className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {formatTime(event.startDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      to {formatTime(event.endDate)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HiMapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{event.location}</div>
                    <div className="text-sm text-gray-500">Event venue</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <HiUsers className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">
                      {event.availableSeats} available
                    </div>
                    <div className="text-sm text-gray-500">
                      of {event.totalSeats} total seats
                    </div>
                  </div>
                </div>
              </div>

              {/* Availability Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Ticket Availability</span>
                  <span>{Math.round(availabilityPercentage)}% available</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      availabilityPercentage > 50
                        ? "bg-green-500"
                        : availabilityPercentage > 20
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${availabilityPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleBookTicket}
                disabled={
                  event.availableSeats === 0 || event.status !== "ACTIVE"
                }
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-lg ${
                  event.availableSeats > 0 && event.status === "ACTIVE"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <HiTicket className="inline w-5 h-5 mr-2" />
                {event.availableSeats === 0
                  ? "Sold Out"
                  : event.status !== "ACTIVE"
                  ? "Event Not Available"
                  : "Book Tickets"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-4">About This Event</h2>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Event Category</h3>
            <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {event.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
