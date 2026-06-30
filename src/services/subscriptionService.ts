"use client";

import { Horizon, TransactionBuilder, Operation, Asset, Memo, BASE_FEE, Networks } from "@stellar/stellar-sdk";
import { getAddress, signTransaction } from "@stellar/freighter-api";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const APP_WALLET = process.env.NEXT_PUBLIC_APP_WALLET || "GBRHWWPYBD5PIALFNLR5POEIV7Z6LHEZS3JKI5EPYKFJMXLL4L5ZJABW";
const SUBSCRIPTION_AMOUNT = "0.1";
const MEMO_TEXT = "STELLARCRED_SUBSCRIPTION";

export async function subscribeWithFreighter(): Promise<string> {
  const addressResult = await getAddress();
  const publicKey = addressResult.address;
  if (!publicKey) {
    throw new Error(addressResult.error || "Could not get wallet address from Freighter.");
  }

  const server = new Horizon.Server(HORIZON_URL);

  const account = await server.loadAccount(publicKey);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: APP_WALLET,
        asset: Asset.native(),
        amount: SUBSCRIPTION_AMOUNT,
      })
    )
    .addMemo(Memo.text(MEMO_TEXT))
    .setTimeout(300)
    .build();

  const xdr = transaction.toXDR();

  const signedResult = await signTransaction(xdr, {
    networkPassphrase: Networks.TESTNET,
  });

  const signedXdr = signedResult.signedTxXdr;
  if (!signedXdr) {
    throw new Error(signedResult.error || "User rejected the transaction.");
  }

  const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);

  const result = await server.submitTransaction(signedTx);

  return result.hash;
}
