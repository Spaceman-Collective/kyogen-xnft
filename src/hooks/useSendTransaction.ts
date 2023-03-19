import { ConfirmOptions, TransactionInstruction } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { useRecoilValue } from "recoil";
import { connectionAtom, gameWallet as gameWalletAtom } from "../recoil";
import { useCallback } from "react";
import { sendAndConfirmRawTransaction } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export const useSendAndConfirmGameWalletTransaction = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const connection = useRecoilValue(connectionAtom);

  return useCallback(
    async (
      instructions: TransactionInstruction[],
      confirmationOptions?: ConfirmOptions
    ) => {
      if (!gameWallet) {
        throw Error("Game wallet not initialized");
      }
      const latestBlockInfo = await connection.getLatestBlockhash();
      const msg = new anchor.web3.TransactionMessage({
        payerKey: gameWallet.publicKey,
        recentBlockhash: latestBlockInfo.blockhash,
        instructions: instructions,
      }).compileToLegacyMessage();
      const tx = new anchor.web3.VersionedTransaction(msg);
      tx.sign([gameWallet]);
      const txSig = bs58.encode(tx.signatures[0]);
      const confirmationStrategy = {
        signature: txSig,
        blockhash: latestBlockInfo.blockhash,
        lastValidBlockHeight: latestBlockInfo.lastValidBlockHeight + 50,
      };
      await sendAndConfirmRawTransaction(
        connection,
        Buffer.from(tx.serialize()),
        confirmationStrategy,
        confirmationOptions
      );
      console.log("TX Confirmed: ", txSig);
      return txSig;
    },
    [connection, gameWallet]
  );
};
