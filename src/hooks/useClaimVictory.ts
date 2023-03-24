import { useCallback } from "react";
import { Structures } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { gameStateAtom, gameWallet as gameWalletAtom } from "../recoil";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";
import { selectCurrentPlayer } from "../recoil/selectors";
import { ixWasmToJs } from "../utils/wasm";

export const useClaimVictory = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const gameState = useRecoilValue(gameStateAtom);
  const currentPlayer = useRecoilValue(selectCurrentPlayer);
  const sendTransaction = useSendAndConfirmGameWalletTransaction();

  return useCallback(async () => {
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

    const ix = ixWasmToJs(
      structuresSdk.claim_victory(
        gameState.instance,
        BigInt(gameState.get_map_id()),
        BigInt(currentPlayer.id)
      )
    );
    const txSig = await sendTransaction([ix], { skipPreflight: true });
    return txSig;
  }, [currentPlayer, gameState, gameWallet, sendTransaction]);
};
