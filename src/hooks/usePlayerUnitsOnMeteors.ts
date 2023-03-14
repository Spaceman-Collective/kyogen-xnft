import { selectPlayerUnitsOnMeteors } from "@/recoil/selectors";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useMeteor } from "./useMeteor";

const usePlayerUnitsOnMeteors = () => {
  const playerOwnedMeteors = useRecoilValue(selectPlayerUnitsOnMeteors);
  const sendMeteorTx = useMeteor();

  useEffect(() => {
    console.log("tiles with player on meteor", playerOwnedMeteors);
    (async () => {
      // TODO: Send transactions for each meteor the player is standing on.
      await Promise.all(
        Object.keys(playerOwnedMeteors).map(async (tileId) => {
          const { meteor, tile } = playerOwnedMeteors[tileId];
          if (!tile.troop) {
            throw new Error("Unreachable");
          }
          const txId = await sendMeteorTx(meteor.id, tileId, tile.troop.id);
          console.log(`Confirmed meteor TX ${txId}`);
        })
      );
    })();
  }, [playerOwnedMeteors, sendMeteorTx]);
};

export default usePlayerUnitsOnMeteors;
