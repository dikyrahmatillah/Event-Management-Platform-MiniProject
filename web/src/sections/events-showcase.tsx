import EventList from "@/components/event-components/event-list";

export default function EventShowcase() {
  return (
    <>
      <div className="py-6">
        <div className="py-4">
          <h2 className="flex justify-center font-mono font-medium text-xl md:text-2xl lg:text-3xl py-6">
            Events Showcase
          </h2>
        </div>
        <div className="flex flex-col w-full">
          <EventList />
        </div>
      </div>
    </>
  );
}
