import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import RegisterForm from "@/features/register/components/register-form";

type RegisterPageProps = {
  role: "CUSTOMER" | "ORGANIZER";
  title: string;
  description: string;
};

export function RegisterPage({ role, title, description }: RegisterPageProps) {
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                {title}
              </CardTitle>
              <CardDescription className="text-center">
                {description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm role={role} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
