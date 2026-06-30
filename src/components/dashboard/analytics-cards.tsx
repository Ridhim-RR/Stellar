"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ArrowLeftRight, Activity, Wallet } from "lucide-react";

interface AnalyticsCardsProps {
  walletAgeDays: number;
  transactionCount: number;
  totalVolume: number;
  recentActivity: number;
}

export function AnalyticsCards({
  walletAgeDays,
  transactionCount,
  totalVolume,
  recentActivity,
}: AnalyticsCardsProps) {
  const items = [
    {
      title: "Wallet Age",
      value: `${walletAgeDays} days`,
      icon: Clock,
      color: "text-blue-400",
    },
    {
      title: "Transactions",
      value: transactionCount.toString(),
      icon: ArrowLeftRight,
      color: "text-green-400",
    },
    {
      title: "Total Volume",
      value: `${totalVolume.toFixed(1)} XLM`,
      icon: Wallet,
      color: "text-purple-400",
    },
    {
      title: "Recent Activity",
      value: `${recentActivity} tx (30d)`,
      icon: Activity,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/60">
              {item.title}
            </CardTitle>
            <item.icon className={`h-4 w-4 ${item.color}`} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
