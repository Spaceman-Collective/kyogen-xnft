import { gameStateAtom } from "@/recoil";
import { KyogenEventCoder } from "@/utils/anchorEvents";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue } from "recoil";

const LOG_START_INDEX = "Program data: ".length;

const useListenToGameEvents = () => {
  const gameState = useRecoilValue(gameStateAtom);

  const handleEvent = useCallback(
    (event: any) => {
      console.log("EVENT: ", event);
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
          // TODO:
          break;
        case "UnitMoved":
          console.log("UnitMoved", event);
          // TODO:
          break;
        case "UnitAttacked":
          // TODO:
          break;
      }
    },
    [gameState]
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
