import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { gameStateAtom } from "../recoil";
import { selectCurrentPlayer } from "../recoil/selectors";
import { UnitNames } from "../types";
import { ixWasmToJs, randomU64 } from "../utils/wasm";
import { useKyogenInstructionSdk } from "./useKyogenInstructionSdk";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";

export const useSpawnUnit = (tileX: number, tileY: number) => {
  const player = useRecoilValue(selectCurrentPlayer);
  const kyogenInstructions = useKyogenInstructionSdk();
  const gameState = useRecoilValue(gameStateAtom);
  const sendTransaction = useSendAndConfirmGameWalletTransaction();

  return useCallback(
    async (unitName: UnitNames) => {
      if (!gameState || !player) {
        return;
      }
      const unitKey = gameState.get_blueprint_key(unitName);

      const ix = ixWasmToJs(
        kyogenInstructions.spawn_unit(
          gameState.instance,
          BigInt(gameState.get_map_id()),
          randomU64(),
          BigInt(gameState!.get_tile_id(tileX, tileY)),
          BigInt(player.id),
          unitKey
        )
      );
      await sendTransaction([ix]);
    },
    [gameState, kyogenInstructions, player, sendTransaction, tileX, tileY]
  );
};
