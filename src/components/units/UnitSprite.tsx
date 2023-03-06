import * as PIXI from "pixi.js";
import { useCallback, useMemo, useState } from "react";
import { Container, Sprite } from "react-pixi-fiber";
import { TILE_LENGTH, UNIT_LENGTH } from "../../constants";
import { useGameConfig } from "../../context/GameConfigContext";
import {
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
  calculateDistance,
  getMoveableTiles,
  normalizeGlobalPointFromViewport,
} from "../../utils/map";
import { MoveHighlight } from "../MoveHighlight";
import { getViewport } from "../PixiViewport";
import { UnitHealth } from "./UnitHealth";

export const UnitSprite = ({
  src,
  movement,
  initialX,
  initialY,
  health,
}: {
  src: PIXI.Texture<PIXI.Resource> | string;
  movement: number;
  initialX: number;
  initialY: number;
  health: number;
}) => {
  const gameConfig = useGameConfig();
  const [dragging, setDragging] = useState(false);
  const [startTile, setStartTile] = useState<[number, number] | null>(null);
  const [hovering, setHovering] = useState(false);
  const moveable = useMemo(
    () =>
      dragging && startTile
        ? getMoveableTiles(
            startTile,
            movement,
            gameConfig.width,
            gameConfig.height
          )
        : [],
    [dragging, gameConfig.height, gameConfig.width, movement, startTile]
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
      (event) => {
        event.stopPropagation();
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
        const finalPosition = calculateUnitPositionOnTileCoords(
          ...(distance <= movement ? coords : startTile!)
        );
        container.position = finalPosition;
      },
      [movement, startTile]
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
        x={initialX}
        y={initialY}
        interactive
      >
        <Sprite
          texture={typeof src === "string" ? PIXI.Texture.from(src) : src}
          height={UNIT_LENGTH}
          width={UNIT_LENGTH}
          x={unitOffset}
          y={unitOffset}
        />
        <UnitHealth health={health} maxHealth={10} showHealthBar={hovering} />
      </Container>
    </>
  );
};
