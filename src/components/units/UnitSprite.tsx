import * as PIXI from "pixi.js";
import { useCallback, useMemo, useState } from "react";
import { Container } from "react-pixi-fiber";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { TILE_LENGTH, UNIT_LENGTH } from "../../constants";
import { useMoveUnit } from "../../hooks/useMoveUnit";
import { gameStateAtom, selectedUnitAtom } from "../../recoil";
import { selectMapDims } from "../../recoil/selectors";
import { Troop } from "../../types";
import {
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
  calculateDistance,
  getMoveableTiles,
  normalizeGlobalPointFromViewport,
} from "../../utils/map";
import { MoveHighlight } from "../MoveHighlight";
import { getViewport } from "../PixiViewport";
import { ClippedUnit } from "./ClippedUnit";
import { UnitHealth } from "./UnitHealth";

export const UnitSprite = ({
  tileX,
  tileY,
  troop,
}: {
  tileX: number;
  tileY: number;
  troop: Troop;
}) => {
  const coords = calculateUnitPositionOnTileCoords(tileX, tileY);
  const mapDims = useRecoilValue(selectMapDims);
  const gameState = useRecoilValue(gameStateAtom);
  const setSelectedUnit = useSetRecoilState(selectedUnitAtom);
  const [dragging, setDragging] = useState(false);
  const [startTile, setStartTile] = useState<[number, number] | null>(null);
  const [hovering, setHovering] = useState(false);
  const moveUnit = useMoveUnit(troop.id, tileX, tileY);
  const movement = Number(troop.movement);
  const moveable = useMemo(
    () =>
      dragging && startTile
        ? getMoveableTiles(startTile, movement, mapDims.width, mapDims.height)
        : [],
    [dragging, mapDims.height, mapDims.width, movement, startTile]
  );

  const onMouseOver: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      setHovering(true);
    }, []);

  const onMouseOut: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      setHovering(false);
    }, []);

  const onDragStart: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();

      const container = event.currentTarget as PIXI.DisplayObject;
      const viewport = getViewport(container);
      if (!viewport) {
        return;
      }
      setStartTile(
        calculateTileCoords(
          normalizeGlobalPointFromViewport(viewport, event.global)
        )
      );
      container.alpha = 0.5;
      setDragging(true);
    }, []);

  const onDragEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      async (event) => {
        event.stopPropagation();
        // Set the selected unit
        setSelectedUnit(troop);

        const container = event.currentTarget as PIXI.DisplayObject;
        const viewport = getViewport(container);
        if (!viewport) {
          return;
        }
        container.alpha = 1;
        setDragging(false);
        // snap sprite to tile
        const coords = calculateTileCoords(
          normalizeGlobalPointFromViewport(viewport, event.global)
        );
        const distance = calculateDistance(startTile!, coords);
        if (distance <= movement) {
          // unit could be moved
          const destinationTileId = gameState!.get_tile_id(
            coords[0],
            coords[1]
          );

          try {
            await moveUnit(destinationTileId);
            container.position = calculateUnitPositionOnTileCoords(...coords);
            return;
          } catch (err) {
            // TODO better error handling
            container.position = calculateUnitPositionOnTileCoords(
              ...startTile!
            );
          }
        }
        // unit could not be moved
        container.position = calculateUnitPositionOnTileCoords(...startTile!);
      },
      [gameState, moveUnit, movement, troop, startTile]
    );

  const onDragMove: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        event.stopPropagation();
        const container = event.currentTarget as PIXI.DisplayObject;
        if (dragging) {
          const viewport = getViewport(container);
          if (!viewport) {
            return;
          }
          const position = normalizeGlobalPointFromViewport(
            viewport,
            event.global
          );
          container.x = position.x - TILE_LENGTH / 2;
          container.y = position.y - TILE_LENGTH / 2;
        }
      },
      [dragging]
    );

  // Since the unit sprite should be centered within the tile, we will need to
  // offset it and any other relative graphics.
  const unitOffset = (TILE_LENGTH - UNIT_LENGTH) / 2;

  return (
    <>
      <MoveHighlight
        // must be outside container in order to remain static
        movement={movement}
        startTile={startTile}
        tiles={moveable}
      />
      <Container
        onpointerdown={onDragStart}
        onpointerup={onDragEnd}
        onpointermove={onDragMove}
        onmouseover={onMouseOver}
        onmouseout={onMouseOut}
        x={coords.x}
        y={coords.y}
        interactive
      >
        <ClippedUnit
          height={UNIT_LENGTH}
          width={UNIT_LENGTH}
          name={troop.name}
          x={unitOffset}
          y={unitOffset}
        />
        <UnitHealth
          health={Number(troop.health)}
          maxHealth={10}
          showHealthBar={hovering}
        />
      </Container>
    </>
  );
};
