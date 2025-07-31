import Link from "next/link";
import { HiMapPin } from "react-icons/hi2";
import { EventTypes } from "@/types/event.types"; // Adjust the path based on your types folder structure

interface EventCardProps {
  event: EventTypes;
}

export default function EventCard({ event }: EventCardProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return { month, day, year };
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formattedDate = formatDate(event.startDate);
  const formattedTime = formatTime(event.startDate);

  return (
    <Link href={`/event-details/${event.id}`}>
      <div className="flex flex-col flex-grow justify-between w-full lg:w-[480px] h-[640px] bg-[#A2C617] cursor-pointer hover:opacity-90 transition-opacity">
        <div className="flex justify-end w-full">
          <div className="flex flex-col items-center justify-center w-[95px] h-[120px] bg-white">
            <p className="font-mono font-bold text-xl leading-8">{formattedDate.month}</p>
            <p className="font-mono font-bold text-4xl leading-8">{formattedDate.day}</p>
            <p className="font-mono font-bold text-xl leading-8">{formattedDate.year}</p>
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
                {formattedTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}