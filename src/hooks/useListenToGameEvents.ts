import { gameFeedAtom, gameStateAtom } from "@/recoil";
import { KyogenEventCoder } from "@/utils/anchorEvents";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useUpdatePlayers, useUpdateTiles } from "../recoil/transactions";

const LOG_START_INDEX = "Program data: ".length;

const useListenToGameEvents = () => {
  const gameState = useRecoilValue(gameStateAtom);
  const updateTiles = useUpdateTiles(false);
  const updatePlayers = useUpdatePlayers();
  const setGameFeed = useSetRecoilState(gameFeedAtom);

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
      
      switch (event.name) {
        case "NewPlayer":
          const newPlayer = gameState.get_player_json(BigInt(event.data.playerId))
          setGameFeed((curr) => ([...curr, {
            type: event.name,
            players: [newPlayer],
            msg: `a new player just joined clan ${event.data.clan}`,
            timestamp,
          }]))
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
          await gameState.update_kyogen_index();
          const spawner = gameState.get_player_json(BigInt(event.data.player));
          updateTiles([gameState.get_tile_json(spawnedTileId)]);
          updatePlayers({
            players: [],
          });
          const spawned = gameState.get_troop_json(BigInt(event.data.unit));
          setGameFeed((curr) => ([...curr, {
            type: event.name,
            players: [
              spawner
            ],
            msg: `%1% spawned a ${spawned.name}`,
            timestamp,
          }]))
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
          updateTiles([
            fromTile,
            toTile
          ]);
          const troop = gameState.get_troop_json(BigInt(event.data.unit))
          
          setGameFeed((curr) => ([...curr, {
            type: event.name,
            players: [gameState.get_player_json(BigInt(troop.player_id))],
            msg: `%1% moved ${troop.name} from [${fromTile.x},${fromTile.y}] to [${toTile.x},${toTile.y}]`,
            timestamp,
          }]))
          break;
        case "UnitAttacked":
          console.log("UNIT ATTACKED", event);
          const defendingTileId = BigInt(event.data.tile);
          const defender = BigInt(event.data.defender);
          const attacker = BigInt(event.data.attacker);
          await gameState.update_entity(attacker);
          await gameState.update_entity(defender);
          await gameState.update_entity(defendingTileId);
          const defendingTroop = gameState.get_troop_json(defender);
          const attackingTroop = gameState.get_troop_json(attacker);
          updateTiles([gameState.get_tile_json(defendingTileId)]);
          setGameFeed((curr) => ([...curr, {
            type: event.name,
            players: [
              gameState.get_player_json(BigInt(attackingTroop.player_id)),
              gameState.get_player_json(BigInt(defendingTroop.player_id))
            ],
            msg: `%1% (${attackingTroop.name}) attacked %2% (${defendingTroop.name})`,
            timestamp,
          }]))
          break;
      }
    },
    [gameState, setGameFeed, updatePlayers, updateTiles]
  );

  useEffect(() => {
    const { connection: xNFTconnection } = window.xnft.solana;
    const connection = new Connection(xNFTconnection.rpcEndpoint);

    const id = connection.onLogs(
      new PublicKey(process.env.NEXT_PUBLIC_KYOGEN_ID as string),
      (logs, ctx) => {
        for (let log of logs.logs) {
          if (log.startsWith("Program data:")) {
            const logStr = log.slice(LOG_START_INDEX);
            const event = KyogenEventCoder.decode(logStr);
            if (event) {
              handleEvent(event);
              console.log("**** EVENT", event);
            }
          }
        }
      },
      "confirmed"
    );
    return () => {
      connection.removeOnLogsListener(id);
    };
  }, [handleEvent]);
};

export default useListenToGameEvents;
