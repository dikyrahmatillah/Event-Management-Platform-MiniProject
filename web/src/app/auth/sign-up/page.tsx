import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import Navbar from "@/components/ui/organism/navbar";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Register
            </CardTitle>
            <CardDescription className="text-center">
              Choose your account type to continue registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <Link href="/auth/sign-up/customer">
                <Button className="w-full cursor-pointer" variant="default">
                  Register as Customer
                </Button>
              </Link>
              <Link href="/auth/sign-up/organizer">
                <Button className="w-full cursor-pointer" variant="secondary">
                  Register as Organizer
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
