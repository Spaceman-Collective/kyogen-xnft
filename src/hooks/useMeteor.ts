import { Structures } from "kyogen-sdk";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { gameStateAtom, gameWallet as gameWalletAtom } from "../recoil";
import { selectCurrentPlayer } from "../recoil/selectors";
import { GameConfig } from "../types";
import { ixWasmToJs } from "../utils/wasm";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";
import toast from "react-hot-toast";

export const useMeteor = () => {
  const currentPlayer = useRecoilValue(selectCurrentPlayer);
  const gameState = useRecoilValue(gameStateAtom);
  const gameWallet = useRecoilValue(gameWalletAtom);
  const sendTransaction = useSendAndConfirmGameWalletTransaction();

  return useCallback(
    async (meteorId: string, tileId: string, unitId: string) => {
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

      const structuresSdk = new Structures(
        process.env.NEXT_PUBLIC_COREDS_ID as string,
        process.env.NEXT_PUBLIC_REGISTRY_ID as string,
        process.env.NEXT_PUBLIC_KYOGEN_ID as string,
        process.env.NEXT_PUBLIC_STRUCTURES_ID as string,
        gameWallet.publicKey.toString()
      );

      const gameConfig = gameState.get_game_config() as GameConfig;
      const ix = ixWasmToJs(
        structuresSdk.use_meteor(
          gameState.instance,
          BigInt(gameState.get_map_id()),
          BigInt(meteorId),
          BigInt(tileId),
          BigInt(unitId),
          BigInt(currentPlayer.id),
          gameConfig.game_token
        )
      );
      const txSig = await sendTransaction([ix], {skipPreflight: true});
      toast.success("Meteor mined...please wait 30s to mine it again!");
      return txSig;
    },
    [currentPlayer, gameState, gameWallet, sendTransaction]
  );
};
