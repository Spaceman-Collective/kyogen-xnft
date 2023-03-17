import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import * as kyogenSdk from "kyogen-sdk";
import { gameIdAtom, gameStateAtom } from "../recoil";
import { useConnection } from "@solana/wallet-adapter-react";
import { Map, Troop, UnitNames } from "../types";
import useSetGameIdFromLocalStorage from "./useSetGameIdFromLocalStorage";
import {
  useUpdateHealers,
  useUpdateMeteors,
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
  const loadGameState = useLoadGameStateFunc();

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);
};

export const useLoadGameStateFunc = () => {
  const { connection } = useConnection();
  const setGameState = useSetRecoilState(gameStateAtom);
  const gameId = useRecoilValue(gameIdAtom);
  const updateTiles = useUpdateTiles(true);
  const updatePlayers = useUpdatePlayers();
  const updateTroops = useUpdateTroops();
  const updateMeteors = useUpdateMeteors();
  const updateHealers = useUpdateHealers();

  return useCallback(async () => {
    if (typeof gameId === "undefined") {
      return;
    }
    const gamestate = new kyogenSdk.GameState(
      connection.rpcEndpoint,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_STRUCTURES_ID as string,
      gameId
    );
    gamestate.add_blueprints(Object.values(UnitNames));
    await gamestate.load_state();
    // TODO error handling
    setGameState(gamestate);
    const map = gamestate.get_map() as Map;
    console.log("gamestate ", map);

    const troops = map.tiles
      .map((tile) => tile.troop)
      .filter((x) => !!x) as Troop[];
    updateTroops({ troops, updateIdList: true });
    updateTiles(map.tiles);
    updateMeteors(map.meteors);
    updateHealers(map.healers);
    updatePlayers({ players: gamestate.get_players(), updateIdList: true });
  }, [
    connection.rpcEndpoint,
    gameId,
    setGameState,
    updateHealers,
    updateMeteors,
    updatePlayers,
    updateTiles,
    updateTroops,
  ]);
};
