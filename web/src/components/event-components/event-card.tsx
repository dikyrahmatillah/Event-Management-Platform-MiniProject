import { EventTypes } from "@/types/event.type";
// import {cloudinary} from "../../../../api/src/configs/cloudinary.config"
// import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { HiMapPin } from "react-icons/hi2";

interface EventProps {
  event: EventTypes;
}
export default function EventCard({ event }: EventProps) {
  return (
    <Link href={`/event-details/`}>
      <div className="flex flex-col flex-grow justify-between w-full lg:w-[480px] h-[640px] bg-[#A2C617] cursor-pointer hover:opacity-90 transition-opacity">
        <div className="flex justify-end w-full">
          <div className="flex flex-col items-center justify-center w-[95px] h-[120px] bg-white">
            <p className="font-mono font-bold text-xl leading-8">
              {dayjs(event.startDate).format("MMM")}
            </p>
            <p className="font-mono font-bold text-4xl leading-8">
              {dayjs(event.startDate).format("DD")}
            </p>
            <p className="font-mono font-bold text-xl leading-8">
              {dayjs(event.startDate).format("YYYY")}
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
              <p className="flex font-mono font-medium text-[14px] leading-1">
                {event.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
