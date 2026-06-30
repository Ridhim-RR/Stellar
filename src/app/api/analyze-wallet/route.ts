import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fetchWalletAnalytics } from "@/services/stellarAnalytics";
import { generateCreditScore, assignCreditLimit } from "@/services/creditScoring";
import type { AnalyzeWalletResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: "walletAddress is required." },
        { status: 400 }
      );
    }

    const analytics = await fetchWalletAnalytics(walletAddress);

    if (!analytics) {
      return NextResponse.json(
        { success: false, message: "Wallet not found on Stellar network or has no activity." },
        { status: 404 }
      );
    }

    let user = await prisma.user.findUnique({
      where: { walletAddress },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { walletAddress },
      });
    }

    const { score, breakdown } = generateCreditScore(analytics, user.subscribed);

    const { creditLimit } = assignCreditLimit(score);

    await prisma.walletAnalytics.create({
      data: {
        user: { connect: { id: user.id } },
        transactionCount: analytics.transactionCount,
        paymentCount: analytics.paymentCount,
        totalVolume: isNaN(analytics.totalVolume) ? 0 : analytics.totalVolume,
        walletAgeDays: analytics.walletAgeDays,
        recentActivity: analytics.recentActivity,
        scoreBreakdown: breakdown as unknown as Prisma.InputJsonValue,
      },
    });

    await prisma.user.update({
      where: { walletAddress },
      data: {
        creditScore: score,
        creditLimit: creditLimit,
      },
    });

    const response: AnalyzeWalletResponse = {
      score,
      creditLimit,
      analytics,
      breakdown,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error("Error analyzing wallet:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
