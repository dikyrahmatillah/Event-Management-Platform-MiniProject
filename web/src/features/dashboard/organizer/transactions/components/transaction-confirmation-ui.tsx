import { Button } from "@/components/ui/atomic/button";
import { Card, CardContent } from "@/components/ui/atomic/card";
import { RefreshCwIcon, ClockIcon, CheckCircleIcon } from "lucide-react";

export function Header({
  count,
  loading,
  onRefresh,
}: {
  count: number;
  loading: boolean;
  onRefresh: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <ClockIcon className="h-5 w-5 text-orange-500" />
        <div>
          <h2 className="text-lg font-semibold">Pending Confirmations</h2>
          <p className="text-sm text-muted-foreground">
            {count} transaction(s) waiting for your approval
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={loading}
        className="self-start sm:self-auto cursor-pointer"
      >
        <RefreshCwIcon
          className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="h-8 animate-pulse bg-muted rounded"></div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse bg-muted/50 rounded"
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EmptyState({ onRefresh }: { onRefresh: () => void }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
        <p className="text-muted-foreground mb-4">
          No transactions waiting for confirmation at the moment.
        </p>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Check Again
        </Button>
      </CardContent>
    </Card>
  );
}
