import { useCallback, useMemo } from "react";
import { Registry, GameState } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { connectionAtom, gameWallet } from "../recoil";

export const useKyogenGameStateSdk = () => {
  const connection = useRecoilValue(connectionAtom);

  return useCallback(
    async (gameInstance: bigint) => {
      const gameState = new GameState(
        connection.rpcEndpoint,
        process.env.NEXT_PUBLIC_KYOGEN_ID as string,
        process.env.NEXT_PUBLIC_REGISTRY_ID as string,
        process.env.NEXT_PUBLIC_COREDS_ID as string,
        process.env.NEXT_PUBLIC_STRUCTURES_ID as string,
        gameInstance
      );

      await gameState.load_state();

      return gameState;
    },
    [connection]
  );
};