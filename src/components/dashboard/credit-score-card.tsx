"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditScoreCardProps {
  score: number;
}

export function CreditScoreCard({ score }: CreditScoreCardProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 80) return "#22c55e";
    if (score >= 60) return "#eab308";
    if (score >= 40) return "#f97316";
    return "#ef4444";
  };

  return (
    <Card className="flex flex-col items-center">
      <CardHeader>
        <CardTitle className="text-center text-lg">Credit Score</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-8">
        <div className="relative flex items-center justify-center">
          <svg className="h-48 w-48 -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={getScoreColor()}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold text-white">{score}</span>
            <span className="text-sm text-white/60">/ 100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
