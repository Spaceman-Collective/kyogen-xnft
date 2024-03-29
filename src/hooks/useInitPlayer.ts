import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import * as anchor from "@coral-xyz/anchor";
import { connectionAtom, gameIdAtom, gameWallet as gameWalletAtom } from "../recoil";
import { Clans } from "../types";
import { ixWasmToJs, randomU64 } from "../utils/wasm";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";
import { sendAndConfirmRawTransaction } from "@solana/web3.js";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import useInitPlayerAta from "./useInitPlayerAta";

/**
 * Initializes a player based on the current game wallet.
 */
export const useInitPlayer = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const gameId = useRecoilValue(gameIdAtom);
  const kyogenInstructions = useKyogenInstructionSdk();
  const initPlayerAta = useInitPlayerAta();
  const connection = useRecoilValue(connectionAtom);

  return useCallback(
    async (clan: Clans) => {
      if (!gameId || !gameWallet) {
        throw new Error("Game ID or Wallet undefined!");
      }

      const {
        metadata: { username },
      } = window.xnft;

      const ix = ixWasmToJs(
        kyogenInstructions.init_player(gameId, randomU64(), username, clan)
      );
      const latestBlockInfo = await connection.getLatestBlockhash();
      const msg = new anchor.web3.TransactionMessage({
        payerKey: gameWallet.publicKey,
        recentBlockhash: latestBlockInfo.blockhash,
        instructions: [ix],
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
        confirmationStrategy
      );
      console.log("Init Player TX Confirmed: ", txSig);
      const ataTxID = await initPlayerAta();
      console.log("Create player ATA confirmed: ", ataTxID);
      return ataTxID;
    },
    [connection, gameId, gameWallet, kyogenInstructions, initPlayerAta]
  );
};
