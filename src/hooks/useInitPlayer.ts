import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import * as anchor from "@coral-xyz/anchor";
import { gameStateAtom, gameWallet as gameWalletAtom } from "../recoil";
import { Clans } from "../types";
import { ixWasmToJs, randomU64 } from "../utils/wasm";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";

/**
 * Initializes a player based on the current game wallet.
 */
export const useInitPlayer = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const gameState = useRecoilValue(gameStateAtom);
  const kyogenInstructions = useKyogenInstructionSdk();

  return useCallback(
    async (clan: Clans) => {
      if (!gameState || !gameWallet) {
        throw new Error("Game wallet or Game state error");
      }
      const { connection } = window.xnft.solana;

      const ix = ixWasmToJs(
        kyogenInstructions.init_player(
          gameState.instance,
          randomU64(),
          gameWallet?.publicKey.toString(),
          clan
        )
      );
      const msg = new anchor.web3.TransactionMessage({
        payerKey: gameWallet.publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions: [ix],
      }).compileToLegacyMessage();
      const tx = new anchor.web3.VersionedTransaction(msg);
      tx.sign([gameWallet]);
      const sig = await connection.sendRawTransaction(tx.serialize())
      // const sig = await connection.sendTransaction(tx);
      await connection.confirmTransaction(sig);
      console.log("Init Player TX Confirmed: ", sig);
      return sig;
    },
    [gameState, gameWallet, kyogenInstructions]
  );
};
