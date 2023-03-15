import { currentSlotAtom } from "@/recoil";
import { selectPlayerUnitsOnMeteors } from "@/recoil/selectors";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import useInitPlayerAta from "./useInitPlayerAta";
import { useMeteor } from "./useMeteor";

const usePlayerUnitsOnMeteors = () => {
  const playerOwnedMeteors = useRecoilValue(selectPlayerUnitsOnMeteors);
  const sendMeteorTx = useMeteor();
  const currentSlot = useRecoilValue(currentSlotAtom);
  const initPlayerAta = useInitPlayerAta();

  useEffect(() => {
    initPlayerAta();
  }, [initPlayerAta]);

  useEffect(() => {
    (async () => {
      // TODO: Send transactions for each meteor the player is standing on.
      const txIds = await Promise.all(
        Object.keys(playerOwnedMeteors).reduce((acc, tileId) => {
          const { meteor, tile } = playerOwnedMeteors[tileId];
          if (!tile.troop) {
            throw new Error("Should be unreachable");
          }
          if (
            Number(meteor.last_used) + Number(meteor.recovery) <=
            currentSlot
          ) {
            acc.push(sendMeteorTx(meteor.id, tileId, tile.troop.id));
          }
          return acc;
        }, [] as Promise<string | undefined>[])
      );
      if (txIds.length) console.log("Sent meteor TXs", txIds);
    })();
  }, [currentSlot, playerOwnedMeteors, sendMeteorTx]);
};

export default usePlayerUnitsOnMeteors;
