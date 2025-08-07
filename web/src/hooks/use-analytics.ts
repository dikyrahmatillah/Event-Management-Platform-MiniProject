"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService } from "@/lib/api/transaction-service";

interface AnalyticsData {
  totalRevenue: number;
  totalAttendees: number;
  dailyData: Array<{
    date: string;
    revenue: number;
    tickets: number;
  }>;
}

interface UseAnalyticsResult {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalytics(
  timeRange: string,
  organizerId?: number
): UseAnalyticsResult {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await transactionService.getAnalytics(
        timeRange,
        organizerId
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
  }, [timeRange, organizerId]);

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
