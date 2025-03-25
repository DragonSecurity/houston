"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import type {
	User,
	Subscription,
	DashboardStats,
	UsageData,
	RevenueData,
	SubscriptionPlanData,
	UserGrowthData,
} from "@/types"
import {toast} from "sonner";

// User queries
export function useUser() {
	return useQuery<User>({
		queryKey: ["user"],
		queryFn: () => apiClient.get("/api/user"),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useUpdateUser() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: Partial<User>) => apiClient.patch("/api/user", data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] })
			toast.success("Success",{
				description: "Your profile has been updated.",
			})
		},
	})
}

// Subscription queries
export function useSubscription(userId: string) {
	return useQuery<Subscription>({
		queryKey: ["subscription", userId],
		queryFn: () => apiClient.get(`/api/subscriptions/${userId}`),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useUpdateSubscription() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: { subscriptionId: string; cancelAtPeriodEnd: boolean }) =>
			apiClient.patch(`/api/subscriptions/${data.subscriptionId}`, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: ["subscription"] })
			toast.success("Success",{
				description: variables.cancelAtPeriodEnd
					? "Your subscription will be canceled at the end of the billing period."
					: "Your subscription has been renewed.",
			})
		},
	})
}

// Dashboard queries
export function useDashboardStats() {
	return useQuery<DashboardStats>({
		queryKey: ["dashboardStats"],
		queryFn: () => apiClient.get("/api/dashboard/stats"),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useUsageData(userId: string) {
	return useQuery<{ usage: UsageData[] }>({
		queryKey: ["usageData", userId],
		queryFn: () => apiClient.get(`/api/subscriptions/${userId}/usage`),
		staleTime: 1000 * 60 * 5, // 5 minutes
	})
}

export function useRevenueData() {
	return useQuery<{ revenue: RevenueData[] }>({
		queryKey: ["revenueData"],
		queryFn: () => apiClient.get("/api/analytics/revenue"),
		staleTime: 1000 * 60 * 15, // 15 minutes
	})
}

export function useSubscriptionDistribution() {
	return useQuery<{ plans: SubscriptionPlanData[] }>({
		queryKey: ["subscriptionDistribution"],
		queryFn: () => apiClient.get("/api/analytics/subscriptions"),
		staleTime: 1000 * 60 * 30, // 30 minutes
	})
}

export function useUserGrowth() {
	return useQuery<{ growth: UserGrowthData[] }>({
		queryKey: ["userGrowth"],
		queryFn: () => apiClient.get("/api/analytics/user-growth"),
		staleTime: 1000 * 60 * 30, // 30 minutes
	})
}

