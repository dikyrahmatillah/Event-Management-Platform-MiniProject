import { Input } from "@/components/ui/atomic/input";
import { Button } from "@/components/ui/atomic/button";
import { HiMapPin, HiMiniChevronDown } from "react-icons/hi2";

export default function SearchBar() {
  return (
    <div className="flex gap-2 w-[400px] border p-1 bg-white">
      <Input
        type="search"
        placeholder="Search event"
        className="font-sans"
      ></Input>
      <Button
        variant={"ghost"}
        size={"sm"}
        className="font-sans gap-1.5 hover:bg-blue-100/40"
      >
        <HiMapPin />
        Location
        <HiMiniChevronDown />
      </Button>
    </div>
  );
}
