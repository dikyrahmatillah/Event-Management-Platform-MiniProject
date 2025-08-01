import Navbar from "@/components/ui/organism/navbar";
import Hero from "@/sections/hero";
import EventList from "@/sections/event-list";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <EventList />
    </>
  );
}
