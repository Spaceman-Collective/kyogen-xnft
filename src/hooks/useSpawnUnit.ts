import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { gameStateAtom } from "../recoil";
import { selectCurrentPlayer } from "../recoil/selectors";
import { UnitNames } from "../types";
import { ixWasmToJs, randomU64 } from "../utils/wasm";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";
import { useSendGameWalletTransaction } from "./useSendTransaction";

export const useSpawnUnit = (tileId: bigint) => {
  const player = useRecoilValue(selectCurrentPlayer);
  const kyogenInstructions = useKyogenInstructionSdk();
  const gameState = useRecoilValue(gameStateAtom);
  const sendTransaction = useSendGameWalletTransaction();

  return useCallback(
    async (unitName: UnitNames) => {
      if (!gameState || !player) {
        return;
      }
      const unitKey = gameState.get_blueprint_key(unitName);

      const ix = ixWasmToJs(
        kyogenInstructions.spawn_unit(
          gameState.instance,
          randomU64(),
          tileId,
          BigInt(player.id),
          unitKey
        )
      );
      await sendTransaction([ix]);
    },
    [gameState, kyogenInstructions, player, sendTransaction, tileId]
  );
};
