import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import {
  gameWallet as gameWalletAtom,
  gameStateAtom,
  selectedUnitAtom,
} from "../recoil";
import { selectCurrentPlayer } from "../recoil/selectors";
import { ixWasmToJs } from "../utils/wasm";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";

export const useAttackUnit = (
  defendingUnitId: string,
  tileX: number,
  tileY: number
) => {
  const selectedUnit = useRecoilValue(selectedUnitAtom);
  const currentPlayer = useRecoilValue(selectCurrentPlayer);
  const gameState = useRecoilValue(gameStateAtom);
  const gameWallet = useRecoilValue(gameWalletAtom);
  const instructionSdk = useKyogenInstructionSdk();
  const sendTransaction = useSendAndConfirmGameWalletTransaction();
  return useCallback(async () => {
    if (!gameWallet) {
      throw Error("No game wallet found");
    }
    if (!currentPlayer) {
      throw Error("No player initialized");
    }
    if (
      !gameState ||
      !selectedUnit ||
      selectedUnit.player_id !== currentPlayer.id
    ) {
      // TODO error handling
      return;
    }
    const ix = ixWasmToJs(
      instructionSdk.attack_unit(
        gameState.instance,
        BigInt(selectedUnit.id),
        BigInt(defendingUnitId),
        BigInt(gameState.get_tile_id(tileX, tileY))
      )
    );
    sendTransaction([ix]);
  }, [
    currentPlayer,
    defendingUnitId,
    gameState,
    gameWallet,
    instructionSdk,
    selectedUnit,
    sendTransaction,
    tileX,
    tileY,
  ]);
};
