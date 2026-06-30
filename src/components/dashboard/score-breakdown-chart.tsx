"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ScoreBreakdown } from "@/types";

interface ScoreBreakdownChartProps {
  breakdown: ScoreBreakdown;
}

const COLORS = ["#3b82f6", "#22c55e", "#a855f7", "#eab308", "#ec4899"];

export function ScoreBreakdownChart({ breakdown }: ScoreBreakdownChartProps) {
  const data = [
    { name: "Wallet Age", score: breakdown.walletAge },
    { name: "Transactions", score: breakdown.transactions },
    { name: "Volume", score: breakdown.volume },
    { name: "Activity", score: breakdown.activity },
    { name: "Subscription", score: breakdown.subscription },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Score Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="score"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
