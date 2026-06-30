import { NextRequest, NextResponse } from "next/server";
import { Horizon } from "@stellar/stellar-sdk";
import { prisma } from "@/lib/prisma";
import { getAppWalletPublicKey } from "@/lib/stellar";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, transactionHash } = await request.json();

    if (!walletAddress || !transactionHash) {
      return NextResponse.json(
        { success: false, message: "walletAddress and transactionHash are required." },
        { status: 400 }
      );
    }

    let payment;
    try {
      const tx = await server.transactions().transaction(transactionHash).call();

      if (!tx) {
        return NextResponse.json(
          { success: false, message: "Transaction not found on Stellar network." },
          { status: 404 }
        );
      }

      const payments = await server
        .operations()
        .forTransaction(transactionHash)
        .call();

      const paymentOp = payments.records.find(
        (op) =>
          (op.type === "payment" || op.type === "create_account") &&
          (op as { to?: string }).to === getAppWalletPublicKey()
      );

      if (!paymentOp) {
        return NextResponse.json(
          {
            success: false,
            message: "No payment found to the application wallet in this transaction.",
          },
          { status: 400 }
        );
      }

      payment = paymentOp as unknown as { amount: string; from: string; to: string };
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid transaction hash or Horizon API error." },
        { status: 400 }
      );
    }

    const amount = parseFloat(payment.amount);
    if (amount < 0.1) {
      return NextResponse.json(
        { success: false, message: "Payment amount is less than 0.1 XLM." },
        { status: 400 }
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

    await prisma.user.update({
      where: { walletAddress },
      data: {
        subscribed: true,
        subscriptionTxHash: transactionHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Subscription verified successfully!",
    });
  } catch (error) {
    console.error("Error verifying subscription:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
