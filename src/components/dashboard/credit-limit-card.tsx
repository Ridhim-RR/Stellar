"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface CreditLimitCardProps {
  creditLimit: number | null;
}

export function CreditLimitCard({ creditLimit }: CreditLimitCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <CreditCard className="h-5 w-5 text-purple-400" />
        <CardTitle className="text-lg">Credit Limit</CardTitle>
      </CardHeader>
      <CardContent>
        {creditLimit ? (
          <div>
            <p className="text-3xl font-bold text-white">
              {creditLimit}{" "}
              <span className="text-lg font-normal text-white/60">USDC</span>
            </p>
            <p className="mt-1 text-sm text-white/40">Mock credit limit</p>
          </div>
        ) : (
          <div>
            <p className="text-lg text-white/60">No Credit</p>
            <p className="mt-1 text-sm text-white/40">
              Improve your score to unlock credit.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
