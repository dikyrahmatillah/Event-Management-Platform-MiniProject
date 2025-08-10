import { Card, CardHeader, CardContent } from "@/components/ui/atomic/card";
import { Skeleton } from "@/components/ui/atomic/skeleton";

export function EventDetailSkeleton() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-8 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
