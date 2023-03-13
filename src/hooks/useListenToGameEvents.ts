import { gameStateAtom } from "@/recoil";
import { KyogenEventCoder } from "@/utils/anchorEvents";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useUpdatePlayers, useUpdateTiles } from "../recoil/transactions";

const LOG_START_INDEX = "Program data: ".length;

const useListenToGameEvents = () => {
  const gameState = useRecoilValue(gameStateAtom);
  const updateTiles = useUpdateTiles(false);
  const updatePlayers = useUpdatePlayers();

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
          const tileId = BigInt(event.data.tile);
          await gameState.update_entity(BigInt(event.data.tile));
          // Update Unit Entity (Create if doesn't exist)
          await gameState.update_entity(BigInt(event.data.unit));
          // Update Entity Player (reduce cards)
          await gameState.update_entity(BigInt(event.data.player));
          // Update kyogen index
          await gameState.update_kyogen_index();
          updateTiles([gameState.get_tile_json(tileId)]);
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
          updateTiles([
            gameState.get_tile_json(fromTileId),
            gameState.get_tile_json(toTileId),
          ]);
          break;
        case "UnitAttacked":
          // TODO:
          break;
      }
    },
    [gameState, updatePlayers, updateTiles]
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
