import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock data for dashboard
  const stats = [
    { label: "Revenue", value: "$12,345", change: "+12%", icon: "dollar-sign" },
    { label: "Users", value: "1,234", change: "+5%", icon: "users" },
    { label: "Conversion", value: "3.2%", change: "+0.8%", icon: "percent" },
    { label: "Sessions", value: "12,543", change: "-2%", icon: "activity" },
  ];

  const revenue = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "2023",
        data: [3000, 4000, 3500, 5000, 4800, 6000],
      },
      {
        label: "2024",
        data: [4000, 4500, 5000, 5500, 6000, 7000],
      },
    ],
  };

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      date_created: "2023-01-15",
      plan: "Pro",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      date_created: "2023-02-20",
      plan: "Basic",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      date_created: "2023-03-10",
      plan: "Free",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      date_created: "2023-04-05",
      plan: "Pro",
    },
  ];

  return NextResponse.json({
    data: {
      stats,
      revenue,
      users,
    },
  });
}
