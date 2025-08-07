"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/lib/api/transaction-service";
import { useSession } from "next-auth/react";

interface AnalyticsData {
  totalRevenue: number;
  totalAttendees: number;
  dailyData: Array<{
    date: string;
    revenue: number;
    attendee: number;
  }>;
}

interface UseAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalytics(timeRange: string): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await transactionService.getAnalytics(
        timeRange,
        session?.user?.accessToken ?? ""
      );
      setData(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch analytics"
      );
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [timeRange, session?.user?.accessToken]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}
