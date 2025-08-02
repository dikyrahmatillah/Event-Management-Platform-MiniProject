import { FaPlus, FaEye, FaChartLine, FaTicket } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";

const quickActions = [
  {
    title: "Create New Event",
    description: "Start planning your next event",
    icon: FaPlus,
    href: "/dashboard/events/create",
    variant: "default" as const,
  },
  {
    title: "View All Events",
    description: "Manage your existing events",
    icon: FaEye,
    href: "/dashboard/events",
    variant: "outline" as const,
  },
  {
    title: "View Statistics",
    description: "Analyze your event performance",
    icon: FaChartLine,
    href: "/dashboard/statistics",
    variant: "outline" as const,
  },
  {
    title: "Manage Tickets",
    description: "Review ticket types and pricing",
    icon: FaTicket,
    href: "/dashboard/tickets",
    variant: "outline" as const,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Commonly used actions to manage your events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="h-auto justify-start p-4"
              asChild
            >
              <a href={action.href}>
                <div className="flex items-center space-x-3">
                  <action.icon className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
