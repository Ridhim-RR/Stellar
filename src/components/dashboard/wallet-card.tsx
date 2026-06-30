"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/utils";
import { Wallet } from "lucide-react";

interface WalletCardProps {
  address: string;
  subscribed: boolean;
}

export function WalletCard({ address, subscribed }: WalletCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5 text-purple-400" />
          Wallet
        </CardTitle>
        <Badge variant={subscribed ? "success" : "warning"}>
          {subscribed ? "Subscribed" : "Not Subscribed"}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-white/60">Connected Address</p>
        <p className="mt-1 font-mono text-sm text-white/90">
          {shortenAddress(address)}
        </p>
        <p className="mt-1 break-all font-mono text-xs text-white/40">
          {address}
        </p>
      </CardContent>
    </Card>
  );
}
