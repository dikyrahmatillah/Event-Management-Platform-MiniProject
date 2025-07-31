import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/atomic/button";
export default function Navbar() {
  return (
    <div className="absolute w-full h-20 flex justify-between py-4 px-10 bg-white">
      <Image
        src="/assets/logo.svg"
        alt="evently logo "
        width={190}
        height={36}
        className="h-10 w-[170px] hidden md:flex lg:flex"
      />
      <Image
        src="/assets/logo_responsive.svg"
        alt="evently logo responsive"
        width={32}
        height={32}
        className="md:hidden lg:hidden"
      />
      <div className="hidden md:flex lg:flex items-center justify-between gap-12">
        <nav className="flex items-center justify-between gap-6">
          <Link href="" className="font-sans">
            Create Event
          </Link>
          <a className="font-sans">Browse event</a>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <Button variant={"secondary"} className="font-sans">
            Sign In
          </Button>
          <Button variant={"default"} className="font-sans">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
