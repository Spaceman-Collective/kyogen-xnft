import { connectionAtom, gameFeedAtom } from "@/recoil";
import { StructuresEventCoder } from "@/utils/anchorEvents";
import { Connection, PublicKey } from "@solana/web3.js";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Observable } from "rxjs";

const LOG_START_INDEX = "Program data: ".length;

const useListenToStructureEvents = () => {
    const connection = useRecoilValue(connectionAtom);
//   const setGameFeed = useSetRecoilState(gameFeedAtom);

  const handleEvent = useCallback(
    async (event: any) => {
      console.log("** STRUCTURES EVENT", event);
      const timestamp = Date.now();

      switch (event.name) {
        case "MeteorMined":
          break;
        case "PortalUsed":
          break;
      }
    },
    []
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
