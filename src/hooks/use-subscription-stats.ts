"use client";

import { useQuery } from "@tanstack/react-query";

interface SubscriptionStats {
  totalUsers: number;
  activeSubscriptions: number;
  plans: {
    [key: string]: number;
  };
}

async function fetchSubscriptionStats(): Promise<SubscriptionStats> {
  const response = await fetch("/api/analytics/subscriptions");

  if (!response.ok) {
    throw new Error("Failed to fetch subscription stats");
  }

  return response.json();
}

export function useSubscriptionStats() {
  return useQuery({
    queryKey: ["subscription-stats"],
    queryFn: fetchSubscriptionStats,
    refetchInterval: 1000 * 60 * 30, // Refetch every 30 minutes
    refetchOnWindowFocus: true,
  });
}
