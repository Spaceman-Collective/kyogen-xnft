import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { gameStateAtom, gameWallet as gameWalletAtom } from "../recoil";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";
import { ixWasmToJs } from "../utils/wasm";
import { selectCurrentPlayer } from "../recoil/selectors";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";

export const useMoveUnit = (unitId: string, tileX: number, tileY: number) => {
  const currentPlayer = useRecoilValue(selectCurrentPlayer);
  const gameState = useRecoilValue(gameStateAtom);
  const gameWallet = useRecoilValue(gameWalletAtom);
  const instructionSdk = useKyogenInstructionSdk();
  const sendTransaction = useSendAndConfirmGameWalletTransaction();

  return useCallback(
    async (destinationTileId: string) => {
      if (!gameWallet) {
        throw Error("No game wallet found");
      }
      if (!currentPlayer) {
        throw Error("No player initialized");
      }
      if (!gameState) {
        // TODO error handling
        return;
      }
      const ix = ixWasmToJs(
        instructionSdk.move_unit(
          gameState.instance,
          BigInt(unitId),
          BigInt(currentPlayer.id),
          BigInt(gameState.get_tile_id(tileX, tileY)),
          BigInt(destinationTileId)
        )
      );
      await sendTransaction([ix]);
    },
    [
      currentPlayer,
      gameState,
      gameWallet,
      instructionSdk,
      sendTransaction,
      tileX,
      tileY,
      unitId,
    ]
  );
};
