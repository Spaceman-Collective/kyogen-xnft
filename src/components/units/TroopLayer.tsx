import { useRecoilValue } from "recoil";
import { selectTiles } from "../../recoil/selectors";
import { UnitSprite } from "./UnitSprite";

export const TroopLayer = () => {
  const tiles = useRecoilValue(selectTiles);
  return (
    <>
      {tiles.map((tile, index) =>
        tile.troop ? (
          <UnitSprite
            key={index}
            troop={tile.troop}
            tileX={tile.x}
            tileY={tile.y}
          />
        ) : null
      )}
    </>
  );
};
