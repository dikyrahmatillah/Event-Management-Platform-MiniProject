import Navbar from "@/components/UI/organism/navbar";
import SearchBar from "@/components/UI/organism/search-bar";
import EventCard from "@/components/event-components/event-card";
import Image from "next/image";
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="w-full h-[240px] bg-fuchsia-950">
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>
      <p className="font-mono font-semibold text-xl md:text-2xl lg:text-3xl">
        Explore Event
      </p>
      <div className="w-full flex flex-wrap py-8 justify-stretch">
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
        <EventCard />
      </div>
    </>
  );
}
