import SearchBar from "@/components/ui/organism/search-bar/search-bar";
export default function Hero() {
  return (
    <div className="flex flex-col justify-between py-4 md:py-20 lg:py-24 w-full min-h-screen bg-fuchsia-950">
      <h1 className="flex justify-center font-sans text-2xl md:text-4xl lg:text-6xl text-white font-bold">
        Find and Book Event Easily
      </h1>
      <div className="flex items-end justify-center">
        <SearchBar />
      </div>
    </div>
  );
}
