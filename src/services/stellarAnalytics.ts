import { Horizon } from "@stellar/stellar-sdk";
import type { WalletAnalyticsData } from "@/types";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

export async function fetchWalletAnalytics(
  walletAddress: string
): Promise<WalletAnalyticsData | null> {
  try {
    const account = await server.loadAccount(walletAddress);

    const transactions = await server
      .transactions()
      .forAccount(walletAddress)
      .limit(200)
      .call();

    const payments = await server
      .payments()
      .forAccount(walletAddress)
      .limit(200)
      .call();

    const allTransactions = transactions.records;
    const allPayments = payments.records.filter(
      (p) =>
        p.type === "payment" || p.type === "create_account"
    ) as unknown as Record<string, unknown>[];

    const transactionCount = allTransactions.length;

    const paymentCount = allPayments.length;

    let totalVolume = 0;
    for (const payment of allPayments) {
      const amount = parseFloat(
        (payment.amount ?? payment.starting_balance ?? "0") as string
      );
      if (!isNaN(amount)) {
        totalVolume += amount;
      }
    }

    let walletAgeDays = 0;
    if (allTransactions.length > 0) {
      const firstTx = allTransactions[allTransactions.length - 1];
      const firstTxDate = new Date(firstTx.created_at);
      const now = new Date();
      const diffMs = now.getTime() - firstTxDate.getTime();
      walletAgeDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActivity = allTransactions.filter((tx) => {
      const txDate = new Date(tx.created_at);
      return txDate >= thirtyDaysAgo;
    }).length;

    return {
      transactionCount,
      paymentCount,
      totalVolume,
      walletAgeDays,
      recentActivity,
    };
  } catch (error) {
    console.error("Error fetching wallet analytics:", error);
    return null;
  }
}
