"use client";

import { useQuery } from "@tanstack/react-query";

interface UserGrowthData {
  date: string;
  newUsers: number;
  churn: number;
}

async function fetchUserGrowth(
  timeRange: "6m" | "1y",
): Promise<UserGrowthData[]> {
  const response = await fetch(
    `/api/analytics/user-growth?timeRange=${timeRange}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user growth data");
  }

  return response.json();
}

export function useUserGrowth(timeRange: "6m" | "1y") {
  return useQuery({
    queryKey: ["user-growth", timeRange],
    queryFn: () => fetchUserGrowth(timeRange),
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
    refetchOnWindowFocus: true,
  });
}
