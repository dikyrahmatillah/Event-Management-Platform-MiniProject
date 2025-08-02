import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/atomic/button";
export default function Navbar() {
  return (
    <div className="w-full h-20 flex justify-between py-4 px-10">
      <Link href="/">
        <Image
          src="/assets/logo.svg"
          alt="evently logo "
          width={190}
          height={36}
          className="h-10 w-[170px] hidden md:flex lg:flex"
        />
      </Link>
      <Link href="/">
        <Image
          src="/assets/logo_responsive.svg"
          alt="evently logo responsive"
          width={32}
          height={32}
          className="md:hidden lg:hidden"
        />
      </Link>
      <div className="md:hidden lg:hidden"></div>
      <div className="hidden md:flex lg:flex items-center justify-between gap-12">
        <nav className="flex items-center justify-between gap-6">
          <Link href="" className="font-sans">
            Create Event
          </Link>
          <a className="font-sans">Browse event</a>
        </nav>
        <div className="flex items-center justify-between gap-4">
          <Link href="/auth/sign-in">
            <Button variant={"secondary"} className="font-sans cursor-pointer ">
              Sign In
            </Button>
          </Link>
          <Button variant={"default"} className="font-sans">
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
