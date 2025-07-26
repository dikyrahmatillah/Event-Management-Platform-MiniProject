import { HiMapPin } from "react-icons/hi2";
export default function EventCard() {
  return (
    <div className="flex flex-col flex-grow justify-between w-full lg:w-[480px] h-[640px] bg-[#A2C617]">
      <div className="flex justify-end w-full">
        <div className="flex flex-col items-center justify-center w-[95px] h-[120px] bg-white">
          <p className="font-mono font-bold text-xl leading-8">MM</p>
          <p className="font-mono font-bold text-4xl leading-8">DD</p>
          <p className="font-mono font-bold text-xl leading-8">YYYY</p>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="px-6 gap-4">
          <p className="flex font-mono font-bold text-2xl md:text-3xl lg:text-4xl ">
            Event Title Placeholder
          </p>
        </div>
        <div className="flex align-baseline">
          <div className="flex px-6 pb-8">
            <HiMapPin className="w-[24px] h-[24px]" />
            <p className="flex font-mono font-medium text-[18px] align-baseline">
              Event location Placeholder
            </p>
          </div>
          <div>
            <p className="flex font-mono font-medium text-[14px]">
              Time placeholder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
