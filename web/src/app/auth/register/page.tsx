import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import RegisterForm from "@/features/register/components/register-form";

export default function Register() {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
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
    </main>
  );
}
