import Navbar from "@/components/ui/organism/navbar";
import Hero from "@/sections/hero";
import EventShowcase from "@/sections/events-showcase";
import Footer from "@/sections/footer";
export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <EventShowcase />
      <Footer />
    </>
  );
}
