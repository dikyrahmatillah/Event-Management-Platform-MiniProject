import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { RegisterForm } from "../components/register-form";

export function RegisterPage() {
  return (
    <div className="min-h-screen grid place-items-center mx-6">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              Register
            </CardTitle>
            <CardDescription className="text-center">
              Create a new account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
