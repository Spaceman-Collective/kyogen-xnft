import { gameFeedAtom, playPhaseAtom, gameStateAtom } from "@/recoil";
import { KyogenEventCoder } from "@/utils/anchorEvents";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  useUpdatePlayers,
  useUpdateTiles,
  useUpdateTroops,
} from "../recoil/transactions";
import { Observable } from "rxjs";
import { PlayPhase, Player, Tile, Troop } from "../types";

const LOG_START_INDEX = "Program data: ".length;

const useListenToGameEvents = () => {
  const gameState = useRecoilValue(gameStateAtom);
  const updateTiles = useUpdateTiles(false);
  const updatePlayers = useUpdatePlayers();
  const setGameFeed = useSetRecoilState(gameFeedAtom);
  const setPlayPhase = useSetRecoilState(playPhaseAtom);
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
      const timestamp = Date.now();
      setPlayPhase(gameState.get_play_phase() as PlayPhase);
      switch (event.name) {
        case "NewPlayer":
          const newPlayer = gameState.get_player_json(
            BigInt(event.data.playerId)
          ) as Player;
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [newPlayer],
              msg: `a new player just joined clan ${event.data.clan}`,
              timestamp,
            },
          ]);
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
          const spawner = gameState.get_player_json(
            BigInt(event.data.player)
          ) as Player;
          updatePlayers({
            players: [spawner],
          });
          const spawned = gameState.get_troop_json(
            BigInt(event.data.unit)
          ) as Troop;
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [spawner],
              msg: `%1% spawned a ${spawned.name}`,
              timestamp,
            },
          ]);
          break;
        case "UnitMoved":
          console.log("UnitMoved", event);
          // TODO can we make BigInt from BN?
          const fromTileId = BigInt(event.data.from);
          const toTileId = BigInt(event.data.to);
          await gameState.update_entity(fromTileId);
          await gameState.update_entity(toTileId);
          await gameState.update_entity(BigInt(event.data.unit));

          const fromTile = gameState.get_tile_json(fromTileId);
          const toTile = gameState.get_tile_json(toTileId);

          const troop = gameState.get_troop_json(
            BigInt(event.data.unit)
          ) as Troop;

          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [
                gameState.get_player_json(BigInt(troop.player_id)) as Player,
              ],
              msg: `%1% moved ${troop.name} from [${fromTile.x},${fromTile.y}] to [${toTile.x},${toTile.y}]`,
              timestamp,
            },
          ]);

          const movedTiles = [fromTile, toTile] as Tile[];
          const movedTroops = movedTiles
            .map((t) => t.troop)
            .filter((x) => !!x) as Troop[];
          updateTroops({ troops: movedTroops });
          updateTiles(movedTiles);
          break;
        case "UnitAttacked":
          console.log("UNIT ATTACKED", event);
          const defendingTileId = BigInt(event.data.tile);
          const defender = BigInt(event.data.defender);
          const defenderPreAttack = gameState.get_troop_json(defender) as Troop;
          const attacker = BigInt(event.data.attacker);
          await gameState.update_entity(attacker);
          await gameState.update_entity(defender);
          await gameState.update_entity(defendingTileId);
          const defendingTroop = gameState.get_troop_json(defender) as Troop;
          const attackingTroop = gameState.get_troop_json(attacker) as Troop;
          const damage =
            Number(defenderPreAttack.health) - Number(defendingTroop.health);
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [
                gameState.get_player_json(
                  BigInt(attackingTroop.player_id)
                ) as Player,
                gameState.get_player_json(
                  BigInt(defendingTroop.player_id)
                ) as Player,
              ],
              msg: `%1% (${attackingTroop.name}) attacked %2% ${
                Number(defendingTroop.health) <= 0
                  ? `killing (${defendingTroop.name})`
                  : `(${defendingTroop.name}) dealing ${damage} damage`
              }`,
              timestamp,
            },
          ]);
          const defendingTiles = [gameState.get_tile_json(defendingTileId)];
          const defendingTroops = defendingTiles
            .map((t) => t.troop)
            .filter((x) => !!x) as Troop[];
          updateTroops({ troops: [...defendingTroops, attackingTroop] });
          updateTiles(defendingTiles);
          break;
      }
    },
    [gameState, setGameFeed, setPlayPhase, updatePlayers, updateTiles, updateTroops]
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
