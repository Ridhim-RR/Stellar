import { Keypair } from "@stellar/stellar-sdk";

export function getAppWalletPublicKey(): string {
  const secret = process.env.APP_WALLET_SECRET;
  if (!secret) {
    return process.env.NEXT_PUBLIC_APP_WALLET || "";
  }
  try {
    return Keypair.fromSecret(secret).publicKey();
  } catch {
    return "";
  }
}
