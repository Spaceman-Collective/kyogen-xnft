import { useRecoilValue } from "recoil";
import { selectTiles } from "../../recoil/selectors";
import { SpawnSprite } from "./Spawn";

export const SpawnLayer = () => {
  const tiles = useRecoilValue(selectTiles);

  return (
    <>
      {tiles.map((tile, index) =>
        tile.spawnable ? (
          <SpawnSprite
            key={index}
            clan={tile.clan}
            tileX={tile.x}
            tileY={tile.y}
          />
        ) : null
      )}
    </>
  );
};
