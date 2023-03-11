import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import * as anchor from "@coral-xyz/anchor";
import { gameStateAtom, gameWallet as gameWalletAtom } from "../recoil";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";
import { ixWasmToJs } from "../utils/wasm";

// TODO load player id
const playerId = BigInt(0);
export const useMoveUnit = (unitId: bigint) => {
  const gameState = useRecoilValue(gameStateAtom);
  const gameWallet = useRecoilValue(gameWalletAtom);
  const instructionSdk = useKyogenInstructionSdk();

  return useCallback(
    async (sourceTileId: bigint, destinationTileId: bigint) => {
      if (!gameWallet) {
        throw Error("No game wallet found");
        return;
      }
      if (!gameState) {
        // TODO error handling
        return;
      }
      const { connection } = window.xnft.solana;
      const ix = ixWasmToJs(
        instructionSdk.move_unit(
          gameState.instance,
          unitId,
          playerId,
          sourceTileId,
          destinationTileId
        )
      );
      const msg = new anchor.web3.TransactionMessage({
        payerKey: gameWallet.publicKey,
        recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
        instructions: [ix],
      }).compileToLegacyMessage();
      const tx = new anchor.web3.VersionedTransaction(msg);
      tx.sign([gameWallet]);
      const sig = await connection.sendTransaction(tx);
      await connection.confirmTransaction(sig);
      console.log("TX Confirmed: ", sig);
    },
    [gameState, gameWallet, instructionSdk, unitId]
  );
};
