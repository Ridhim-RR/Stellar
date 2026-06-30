import { NextResponse } from "next/server";
import { Keypair } from "@stellar/stellar-sdk";

export async function GET() {
  const secret = process.env.APP_WALLET_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "App wallet not configured." },
      { status: 500 }
    );
  }
  try {
    const kp = Keypair.fromSecret(secret);
    return NextResponse.json({
      success: true,
      data: { address: kp.publicKey() },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid app wallet configuration." },
      { status: 500 }
    );
  }
}
