import { useCallback, useRef } from "react";
import { useRecoilValue } from "recoil";
import * as PIXI from "pixi.js";
import { UNIT_OFFSET } from "../../constants";
import {
  selectTilesWithEnemiesInSelectedUnitAttackRange,
  selectTroopFromSelectedTile,
} from "../../recoil/selectors";
import {
  calculateCenteredPositionFromCenter,
  calculateDistance,
  calculateRotationFromTileCoords,
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
  normalizeGlobalPointFromViewport,
} from "../../utils/map";
import { Circle } from "../PixiComponents";
import { Container, Sprite } from "react-pixi-fiber";
import { useAttackUnit } from "../../hooks/useAttackUnit";
import { DamageTexture } from "../../textures";
import { troopContainerRefAtomFamily, troopsAtomFamily } from "../../recoil";
import { ease } from "pixi-ease";
import { getViewport } from "../PixiViewport";

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
  const containerRef = useRef<Container>(null);
  const selectedUnit = useRecoilValue(selectTroopFromSelectedTile);
  const attackingContainerRef = useRecoilValue(
    troopContainerRefAtomFamily(selectedUnit?.id ?? "")
  );
  const coords = calculateUnitPositionOnTileCoords(tileX, tileY);
  const troop = useRecoilValue(troopsAtomFamily(troopId));
  const attackUnit = useAttackUnit(troopId, tileX, tileY);
  const onPointerDown: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      const button = event.currentTarget as PIXI.DisplayObject;
      button.alpha = 0.5;
    }, []);

  const onPointerUp: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      async (event) => {
        event.stopPropagation();
        const button = event.currentTarget as PIXI.DisplayObject;
        button.alpha = 1;
        const viewport = getViewport(button);
        if (
          viewport &&
          attackingContainerRef?.current &&
          containerRef?.current
        ) {
          const scaleX = viewport.lastViewport?.scaleX ?? 1;
          const scaleY = viewport.lastViewport?.scaleY ?? 1;
          // NOTE: sometimes after moving the tile, `getGlobalPosition` returns 0. This should
          // be ok since it should be updated by the time the cool down finishes.
          const globalAttackerPosition =
            attackingContainerRef.current.getGlobalPosition();
          const attackerPosition = normalizeGlobalPointFromViewport(
            viewport,
            globalAttackerPosition
          );
          const globalDefenderPosition = (
            containerRef.current as unknown as PIXI.DisplayObject
          )?.getGlobalPosition();
          const defenderPosition = normalizeGlobalPointFromViewport(
            viewport,
            globalDefenderPosition
          );
          // tiles are incorrect, when zoomed
          console.log("pos ", attackerPosition, defenderPosition);

          // get the tiles based on container, so we can use that as our refernce for coordinates.
          const attackingTile = calculateTileCoords(attackerPosition, scaleX, scaleY);
          const centerOfAttackingTile = calculateCenteredPositionFromCenter(
            ...attackingTile
          );
          const defendingTile = calculateTileCoords(defenderPosition, scaleX, scaleY);
          const centerOfDefenderTile = calculateCenteredPositionFromCenter(
            ...defendingTile
          );
          console.log("test ", attackingTile, defendingTile);
          // Calcualte a point that is 20 points away from the attacking tile
          // along the vector between attacking and defending tiles.
          const totalDistance = calculateDistance(
            [centerOfAttackingTile.x, centerOfAttackingTile.y],
            [centerOfDefenderTile.x, centerOfDefenderTile.y]
          );
          const distanceRatio = 20 / totalDistance;
          const rotation = calculateRotationFromTileCoords(
            attackingTile,
            defendingTile
          );
          const deg90 = Math.PI / 2;
          // make it so that containers on top require 0 rotation, left is 90 deg, etc.
          const offsetRotation = rotation - deg90;
          const containerBounds = attackingContainerRef.current.getBounds();
          const pivotXOffset = containerBounds.width / 2;
          const pivotYOffset = containerBounds.height / 2;
          const animStartX = attackingContainerRef.current.x + pivotXOffset;
          const animStartY = attackingContainerRef.current.y + pivotYOffset;
          const diffX = centerOfDefenderTile.x - centerOfAttackingTile.x;
          const diffY = centerOfDefenderTile.y - centerOfAttackingTile.y;
          const translatePointX = diffX
            ? centerOfAttackingTile.x + distanceRatio * diffX
            : animStartX;
          const translatePointY = diffY
            ? centerOfAttackingTile.y + distanceRatio * diffY
            : animStartY;
          // Set the pivot of the attacking Container so we can rotate around the center.
          attackingContainerRef.current.x = animStartX;
          attackingContainerRef.current.y = animStartY;
          attackingContainerRef.current.pivot.x = pivotXOffset;
          attackingContainerRef.current.pivot.y = pivotYOffset;
          // Chain animations to rotate and move the attacker towards the defender, then reverse to it's
          // original position.
          ease
            .add(
              attackingContainerRef.current,
              // x is ending position of animation
              { rotation: -offsetRotation },
              { duration: 300, ease: "easeInQuint" }
            )
            .once("complete", () => {
              if (!attackingContainerRef.current) {
                throw Error("Attacker could not be found during animation");
              }
              ease
                .add(
                  attackingContainerRef.current,
                  { x: translatePointX, y: translatePointY },
                  { duration: 300, ease: "easeInQuint" }
                )
                .once("complete", () => {
                  if (!attackingContainerRef.current) {
                    throw Error("Attacker could not be found during animation");
                  }
                  ease
                    .add(
                      attackingContainerRef.current,
                      { x: animStartX, y: animStartY },
                      { duration: 300, ease: "easeOutQuint" }
                    )
                    .once("complete", () => {
                      if (!attackingContainerRef.current) {
                        throw Error(
                          "Attacker could not be found during animation"
                        );
                      }
                      ease
                        .add(
                          attackingContainerRef.current,
                          { rotation: 0 },
                          { duration: 300, ease: "easeOutQuint" }
                        )
                        .once("complete", () => {
                          if (!attackingContainerRef.current) {
                            throw Error(
                              "Attacker could not be found during animation"
                            );
                          }
                          // reset pivot at the end of the animation chain
                          attackingContainerRef.current.x =
                            attackingContainerRef.current.x - pivotXOffset;
                          attackingContainerRef.current.y =
                            attackingContainerRef.current.y - pivotYOffset;
                          attackingContainerRef.current.pivot.x = 0;
                          attackingContainerRef.current.pivot.y = 0;
                        });
                    });
                });
            });
        }
        // await attackUnit();
      },
      [attackingContainerRef]
    );

  // if (!troop) {
  //   return null;
  // }

  return (
    <Container
      ref={containerRef}
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
