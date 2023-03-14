import { useRecoilValue } from "recoil";
import { troopIdsAtom } from "../../recoil";
import { TroopUnit } from "./UnitSprite";

export const TroopLayer = () => {
  const troopIds = useRecoilValue(troopIdsAtom);

  return (
    <>
      {troopIds.map((troopId) => (
        <TroopUnit key={troopId} troopId={troopId} />
      ))}
    </>
  );
};
