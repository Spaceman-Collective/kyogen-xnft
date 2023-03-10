import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import * as kyogenSdk from "kyogen-sdk";
import { gameStateAtom } from "../recoil";
import { useConnection } from "@solana/wallet-adapter-react";

/**
 *
 * @param instance - instance ID of the game
 */
export const useLoadGameState = (
  instance: string | number | bigint | undefined
) => {
  const { connection } = useConnection();
  const setGameState = useSetRecoilState(gameStateAtom);

  useEffect(() => {
    if (typeof instance === "undefined") {
      return;
    }
    const _instance = BigInt(instance);
    const gamestate = new kyogenSdk.GameState(
      connection.rpcEndpoint,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      _instance
    );
    (async () => {
      await gamestate.load_state();
      // TODO error handling
      setGameState(gamestate);
    })();
  }, [connection.rpcEndpoint, instance, setGameState]);
};
