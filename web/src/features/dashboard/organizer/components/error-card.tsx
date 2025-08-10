import { Button } from "@/components/ui/atomic/button";
import { useRouter } from "next/navigation";

export function ErrorCard({
  message,
  showBack = false,
}: {
  message: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-60 text-muted-foreground">
      <span className="text-lg font-semibold mb-2">{message}</span>
      {showBack && (
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          Back
        </Button>
      )}
    </div>
  );
}
