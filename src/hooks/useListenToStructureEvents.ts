import { connectionAtom, gameFeedAtom, gameStateAtom } from "@/recoil";
import { useUpdateMeteors } from "@/recoil/transactions";
import { Meteor, Player } from "@/types";
import { StructuresEventCoder } from "@/utils/anchorEvents";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Observable } from "rxjs";

const LOG_START_INDEX = "Program data: ".length;

const useListenToStructureEvents = () => {
  const gameState = useRecoilValue(gameStateAtom);
  const connection = useRecoilValue(connectionAtom);
  const updateMeteors = useUpdateMeteors();
  const setGameFeed = useSetRecoilState(gameFeedAtom);

  const handleEvent = useCallback(
    async (event: any) => {
      if (!gameState) return;
      const timestamp = Date.now();

      switch (event.name) {
        case "MeteorMined":
          const meteorId = BigInt(event.data.meteor);
          await gameState.update_entity(meteorId);
          const meteor = gameState.get_structure_json(meteorId) as Meteor;
          updateMeteors([meteor]);
          const miner = gameState.get_player_json(
            BigInt(event.data.player)
          ) as Player;
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [miner],
              msg: `%1% mined ${meteor.structure.Meteor.solarite_per_use} solarite`,
              timestamp,
            },
          ]);
          break;
        case "PortalUsed":
          break;
      }
    },
    [gameState, setGameFeed, updateMeteors]
  );

  useEffect(() => {
    let connectionId: number;
    let eventsObservable: Observable<{
      slot: number;
      name: string;
      data: any;
    }> = new Observable((subscriber) => {
      connectionId = connection.onLogs(
        new PublicKey(process.env.NEXT_PUBLIC_STRUCTURES_ID as string),
        (logs, ctx) => {
          for (let log of logs.logs) {
            if (log.startsWith("Program data:")) {
              const logStr = log.slice(LOG_START_INDEX);
              const event = StructuresEventCoder.decode(logStr);
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
  }, [connection, handleEvent]);
};

export default useListenToStructureEvents;
