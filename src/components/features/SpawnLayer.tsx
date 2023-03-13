import { useRecoilValue } from "recoil";
import { tileIdsAtom } from "../../recoil";
import { Spawn } from "./Spawn";

export const SpawnLayer = () => {
  const tileIds = useRecoilValue(tileIdsAtom);

  return (
    <>
      {tileIds.map((tileId) => (
        <Spawn key={tileId} tileId={tileId} />
      ))}
    </>
  );
};
