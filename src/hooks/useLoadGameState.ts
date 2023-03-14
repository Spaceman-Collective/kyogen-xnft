import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import * as kyogenSdk from "kyogen-sdk";
import { gameIdAtom, gameStateAtom } from "../recoil";
import { useConnection } from "@solana/wallet-adapter-react";
import { Map, Troop, UnitNames } from "../types";
import useSetGameIdFromLocalStorage from "./useSetGameIdFromLocalStorage";
import {
  useUpdatePlayers,
  useUpdateTiles,
  useUpdateTroops,
} from "../recoil/transactions";

/**
 *
 * @param instance - instance ID of the game
 */
export const useLoadGameState = () => {
  useSetGameIdFromLocalStorage();
  const { connection } = useConnection();
  const setGameState = useSetRecoilState(gameStateAtom);
  const gameId = useRecoilValue(gameIdAtom);
  const updateTiles = useUpdateTiles(true);
  const updatePlayers = useUpdatePlayers();
  const updateTroops = useUpdateTroops();

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
      const map = gamestate.get_map() as Map;
      const troops = map.tiles
        .map((tile) => tile.troop)
        .filter((x) => !!x) as Troop[];
      updateTiles(map.tiles);
      updatePlayers({ players: gamestate.get_players(), updateIdList: true });
      updateTroops({ troops, updateIdList: true });
    })();
  }, [
    connection.rpcEndpoint,
    gameId,
    setGameState,
    updatePlayers,
    updateTiles,
    updateTroops,
  ]);
};
