import { Card, CardContent } from "@/components/ui/atomic/card";

interface AttendeeStatsProps {
  stats: {
    total: number;
    registered: number;
    attended: number;
    noShow: number;
  };
}

export function AttendeeStats({ stats }: AttendeeStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {stats.total}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Total Attendees
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-yellow-600">
            {stats.registered}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Registered</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-green-600">
            {stats.attended}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Attended</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="text-xl sm:text-2xl font-bold text-red-600">
            {stats.noShow}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">No Show</p>
        </CardContent>
      </Card>
    </div>
  );
}
