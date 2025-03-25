"use client";

import { useQuery } from "@tanstack/react-query";

interface DailyUsage {
  date: string;
  apiCalls: number;
  storage: number;
}

interface SubscriptionUsage {
  dailyUsage: DailyUsage[];
  totalApiCalls: number;
  totalStorage: number;
}

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: string;
  currentPeriodEnd: string;
  usage: SubscriptionUsage;
}

async function fetchSubscription(userId: string): Promise<Subscription> {
  const response = await fetch(`/api/subscriptions/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch subscription data");
  }

  return response.json();
}

export function useSubscription(userId: string) {
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: () => fetchSubscription(userId),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
  });
}
