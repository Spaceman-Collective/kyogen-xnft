import { gameStateAtom } from "@/recoil";
import { KyogenEventCoder } from "@/utils/anchorEvents";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import {
  useUpdatePlayers,
  useUpdateTiles,
  useUpdateTroops,
} from "../recoil/transactions";
import { Observable } from "rxjs";
import { Tile, Troop } from "../types";

const LOG_START_INDEX = "Program data: ".length;

const useListenToGameEvents = () => {
  const gameState = useRecoilValue(gameStateAtom);
  const updateTiles = useUpdateTiles(false);
  const updatePlayers = useUpdatePlayers();
  const updateTroops = useUpdateTroops();

  const handleEvent = useCallback(
    async (event: any) => {
      if (!gameState) {
        return;
      }
      console.log("EVENT: ", event);
      if (!gameState) return;
      if (event.data.instance.toString() != gameState.instance.toString()) {
        return;
      }

      switch (event.name) {
        case "NewPlayer":
          // TODO:
          break;
        case "GameStateChanged":
          if (event.data.newState.play) {
            // TODO:
          } else if (event.data.newState.paused) {
            // TODO:
          } else if (event.data.newState.lobby) {
            // TODO:
          } else if (event.data.newState.build) {
            // TODO:
          } else if (event.data.newState.finished) {
            // TODO:
          }
          break;
        case "SpawnClaimed":
          // TODO:
          break;
        case "UnitSpawned":
          console.log("UnitSpawned", event);
          const spawnedTileId = BigInt(event.data.tile);
          await gameState.update_entity(BigInt(event.data.tile));
          // Update Unit Entity (Create if doesn't exist)
          await gameState.update_entity(BigInt(event.data.unit));
          // Update Entity Player (reduce cards)
          await gameState.update_entity(BigInt(event.data.player));
          // Update kyogen index
          await gameState.update_index();
          const tile = gameState.get_tile_json(spawnedTileId) as Tile;
          if (tile.troop) {
            updateTroops({ appendToIdList: true, troops: [tile.troop] });
          }
          updateTiles([tile]);
          updatePlayers({
            players: [gameState.get_player_json(BigInt(event.data.player))],
          });
          break;
        case "UnitMoved":
          console.log("UnitMoved", event);
          // TODO can we make BigInt from BN?
          const fromTileId = BigInt(event.data.from);
          const toTileId = BigInt(event.data.to);
          await gameState.update_entity(fromTileId);
          await gameState.update_entity(toTileId);
          await gameState.update_entity(BigInt(event.data.unit));
          const movedTiles = [
            gameState.get_tile_json(fromTileId),
            gameState.get_tile_json(toTileId),
          ] as Tile[];
          const movedTroops = movedTiles
            .map((t) => t.troop)
            .filter((x) => !!x) as Troop[];
          updateTroops({ troops: movedTroops });
          updateTiles(movedTiles);
          break;
        case "UnitAttacked":
          console.log("UNIT ATTACKED", event);
          const defendingTileId = BigInt(event.data.tile);
          await gameState.update_entity(BigInt(event.data.attacker));
          await gameState.update_entity(BigInt(event.data.defender));
          await gameState.update_entity(defendingTileId);
          const attackedTiles = [gameState.get_tile_json(defendingTileId)];
          const attackedTroops = attackedTiles
            .map((t) => t.troop)
            .filter((x) => !!x) as Troop[];
          updateTroops({ troops: attackedTroops });
          updateTiles(attackedTiles);
          break;
      }
    },
    [gameState, updatePlayers, updateTiles, updateTroops]
  );

  useEffect(() => {
    const { connection: xNFTconnection } = window.xnft.solana;
    const connection = new Connection(xNFTconnection.rpcEndpoint);
    let connectionId: number;
    let eventsObservable: Observable<{
      slot: number;
      name: string;
      data: any;
    }> = new Observable((subscriber) => {
      connectionId = connection.onLogs(
        new PublicKey(process.env.NEXT_PUBLIC_KYOGEN_ID as string),
        (logs, ctx) => {
          for (let log of logs.logs) {
            if (log.startsWith("Program data:")) {
              const logStr = log.slice(LOG_START_INDEX);
              const event = KyogenEventCoder.decode(logStr);
              if (event) {
                subscriber.next({
                  slot: ctx.slot,
                  name: event.name,
                  data: event.data,
                });
              }
            }
          }
        },
        "confirmed"
      );
    });
    eventsObservable.subscribe(async (event) => {
      handleEvent(event);
    });
    return () => {
      if (!!connectionId) connection.removeOnLogsListener(connectionId);
    };
  }, [handleEvent]);
};

export default useListenToGameEvents;
