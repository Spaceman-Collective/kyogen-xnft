import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import * as kyogenSdk from "kyogen-sdk";
import { gameIdAtom, gameStateAtom } from "../recoil";
import { useConnection } from "@solana/wallet-adapter-react";
import { UnitNames } from "../types";
import useSetGameIdFromLocalStorage from "./useSetGameIdFromLocalStorage";

/**
 *
 * @param instance - instance ID of the game
 */
export const useLoadGameState = () => {
  useSetGameIdFromLocalStorage();
  const { connection } = useConnection();
  const setGameState = useSetRecoilState(gameStateAtom);
  const gameId = useRecoilValue(gameIdAtom);

  useEffect(() => {
    if (typeof gameId === "undefined") {
      return;
    }
    const gamestate = new kyogenSdk.GameState(
      connection.rpcEndpoint,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      gameId
    );
    (async () => {
      gamestate.add_blueprints(Object.values(UnitNames));
      await gamestate.load_state();
      console.log("gamestate ", gamestate.get_map());
      // TODO error handling
      setGameState(gamestate);
    })();
  }, [connection.rpcEndpoint, gameId, setGameState]);
};
