"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";

export function PointsCard() {
  const points = {
    total: 15500,
    history: [
      {
        id: 1,
        amount: 10000,
        description: "Referral bonus",
        date: "2025-07-02",
      },
      {
        id: 2,
        amount: 500,
        description: "Event review bonus",
        date: "2025-07-25",
      },
      {
        id: 3,
        amount: 5000,
        description: "VIP ticket purchase",
        date: "2025-07-15",
      },
    ],
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Points</CardTitle>
        <CardDescription>
          View your current points balance and history
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-3xl font-bold">{points.total}</p>
          </div>
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium">Recent Points Activity</p>
          <div className="space-y-3 mt-2">
            {points.history.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <div className="text-sm font-medium">+{item.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
