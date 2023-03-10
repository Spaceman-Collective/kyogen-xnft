import { useRecoilValue } from "recoil";
import { selectTiles } from "../../recoil/selectors";
import { Tile } from "../../types";
import { calculateUnitPositionOnTileCoords } from "../../utils/map";
import { SpawnSprite } from "./Spawn";

const Spawn = ({ tile }: { tile: Tile }) => {
  const coords = calculateUnitPositionOnTileCoords(tile.x, tile.y);

  return <SpawnSprite clan={tile.clan} x={coords.x} y={coords.y} />;
};

export const SpawnLayer = () => {
  const tiles = useRecoilValue(selectTiles);

  return (
    <>
      {tiles.map((tile, index) =>
        tile.spawnable ? <Spawn key={index} tile={tile} /> : null
      )}
    </>
  );
};
