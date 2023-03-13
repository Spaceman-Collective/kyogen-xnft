import { useRecoilValue } from "recoil";
import { tileIdsAtom } from "../../recoil";
import { TroopUnit } from "./UnitSprite";

export const TroopLayer = () => {
  const tileIds = useRecoilValue(tileIdsAtom);
  return (
    <>
      {tileIds.map((tileId) => (
        <TroopUnit key={tileId} tileId={tileId} />
      ))}
    </>
  );
};
