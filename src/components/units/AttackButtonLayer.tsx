import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import * as PIXI from "pixi.js";
import { UNIT_OFFSET } from "../../constants";
import { selectTilesWithEnemiesInSelectedUnitAttackRange } from "../../recoil/selectors";
import { calculateUnitPositionOnTileCoords } from "../../utils/map";
import { Circle } from "../PixiComponents";
import { Container, Sprite } from "react-pixi-fiber";
import { useAttackUnit } from "../../hooks/useAttackUnit";
import { DamageTexture } from "../../textures";
import { troopsAtomFamily } from "../../recoil";

export const AttackButtonLayer = () => {
  const attackableTiles = useRecoilValue(
    selectTilesWithEnemiesInSelectedUnitAttackRange
  );

  if (!attackableTiles.length) {
    return null;
  }

  return (
    <>
      {attackableTiles.map((tile) => (
        <AttackButton
          key={`${tile.x}_${tile.y}`}
          tileX={tile.x}
          tileY={tile.y}
          troopId={tile.troop?.id ?? ""}
        />
      ))}
    </>
  );
};

const radius = 10;
const attackIconLength = radius * 1.4;
const AttackButton = ({
  tileX,
  tileY,
  troopId,
}: {
  tileX: number;
  tileY: number;
  troopId: string;
}) => {
  const coords = calculateUnitPositionOnTileCoords(tileX, tileY);
  const troop = useRecoilValue(troopsAtomFamily(troopId));
  const attackUnit = useAttackUnit(troopId, tileX, tileY);
  const onPointerDown: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      console.log(event);
      const button = event.currentTarget as PIXI.DisplayObject;
      button.alpha = 0.5;
    }, []);

  const onPointerUp: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      async (event) => {
        event.stopPropagation();
        console.log(event);
        const button = event.currentTarget as PIXI.DisplayObject;
        button.alpha = 1;
        await attackUnit();
      },
      [attackUnit]
    );

  if (!troop) {
    return null;
  }

  return (
    <Container
      x={coords.x + UNIT_OFFSET}
      y={coords.y + UNIT_OFFSET}
      interactive
      onpointerdown={onPointerDown}
      onpointerup={onPointerUp}
    >
      <Circle fill={0x9d1422} fillAlpha={0.8} radius={radius}>
        <Sprite
          anchor={0.5}
          texture={DamageTexture}
          height={attackIconLength}
          width={attackIconLength}
        />
      </Circle>
    </Container>
  );
};
