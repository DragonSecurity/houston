"use client";

import { useQuery } from "@tanstack/react-query";

interface RevenueData {
  date: string;
  revenue: number;
  mrr: number;
}

async function fetchRevenue(
  timeRange: "30d" | "90d" | "1y",
): Promise<RevenueData[]> {
  const response = await fetch(`/api/analytics/revenue?timeRange=${timeRange}`);

  if (!response.ok) {
    throw new Error("Failed to fetch revenue data");
  }

  return response.json();
}

export function useRevenue(timeRange: "30d" | "90d" | "1y") {
  return useQuery({
    queryKey: ["revenue", timeRange],
    queryFn: () => fetchRevenue(timeRange),
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
    refetchOnWindowFocus: true,
  });
}
