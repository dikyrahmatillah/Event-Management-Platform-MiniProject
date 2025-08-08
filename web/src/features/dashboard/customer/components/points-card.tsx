"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { pointService, type PointsData } from "@/lib/api/point-service";

interface ExtendedUser {
  id?: string;
  accessToken?: string;
}

export function PointsCard() {
  const { data: session } = useSession();
  const [pointsData, setPointsData] = useState<PointsData>({
    totalBalance: 0,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPointsData = async () => {
      const user = session?.user as ExtendedUser;
      if (!user?.id || !user?.accessToken) return;

      try {
        setLoading(true);
        const data = await pointService.getUserPoints(
          Number(user.id),
          user.accessToken
        );
        setPointsData(data);
      } catch (error) {
        console.error("Failed to fetch points data:", error);
        // Keep default data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchPointsData();
  }, [session]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Points</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <p className="text-3xl font-bold">
              {pointsData.totalBalance.toLocaleString()}
            </p>
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
            {pointsData.history.length > 0 ? (
              pointsData.history.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      item.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.amount > 0 ? "+" : ""}
                    {item.amount}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No point transactions yet
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
