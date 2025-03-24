"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, Percent, Activity } from "lucide-react";
import { LineChart } from "@/components/charts";
import { toast } from "sonner";

export function DashboardView() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/demo");
        const data = await response.json();

        if (data.data) {
          setDashboardData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Failed to load dashboard data", {
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();

    // Show welcome message
    toast.success("Welcome to Houston!", {
      description:
        "This is a sample dashboard to get you started. Please read the documentation to learn how to build your own features.",
    });
  }, [toast]);

  // Map icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    "dollar-sign": <DollarSign className="h-4 w-4" />,
    users: <Users className="h-4 w-4" />,
    percent: <Percent className="h-4 w-4" />,
    activity: <Activity className="h-4 w-4" />,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData?.stats.map((stat: any, index: number) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                  {iconMap[stat.icon]}
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={`font-medium ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                >
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
          <CardDescription>Monthly revenue overview</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <LineChart data={dashboardData?.revenue} />
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Recent user activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dashboardData?.users.map((user: any) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {new Date(user.date_created).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.plan === "Pro"
                          ? "default"
                          : user.plan === "Basic"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {user.plan}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
