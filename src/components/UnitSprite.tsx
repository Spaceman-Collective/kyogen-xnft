import * as PIXI from "pixi.js";
import { useCallback, useMemo, useState } from "react";
import { Container, Sprite } from "react-pixi-fiber";
import { TILE_LENGTH } from "../constants";
import { useGameConfig } from "../context/GameConfigContext";
import {
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
  calculateDistance,
  getMoveableTiles,
  normalizeGlobalPointFromViewport,
} from "../utils/map";
import { HealthBar, HealthBarHeight, HealthBarWidth } from "./HealthBar";
import { MoveHighlight } from "./MoveHighlight";
import { getViewport } from "./PixiViewport";

export const UnitSprite = ({
  src,
  movement,
  initialX,
  initialY,
}: {
  src: PIXI.Texture<PIXI.Resource> | string;
  movement: number;
  initialX: number;
  initialY: number;
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
    useCallback(() => {
      setHovering(true);
    }, []);

  const onMouseOut: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(() => {
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

  return (
    <>
      <MoveHighlight
        // must be outside container in order to remain static
        movement={movement}
        startTile={startTile}
        tiles={moveable}
      />
      <Container
        height={TILE_LENGTH}
        onpointerdown={onDragStart}
        onpointerup={onDragEnd}
        onpointermove={onDragMove}
        onmouseover={onMouseOver}
        onmouseout={onMouseOut}
        width={TILE_LENGTH}
        x={initialX}
        y={initialY}
        interactive
      >
        <Sprite
          texture={typeof src === "string" ? PIXI.Texture.from(src) : src}
          // TODO fix this. Naively setting dims to same as tile to skip additional coord calcs.
          height={TILE_LENGTH}
          width={TILE_LENGTH}
        />
        {hovering && (
          <HealthBar
            percent={0.5}
            x={(TILE_LENGTH - HealthBarWidth) / 2}
            y={TILE_LENGTH - HealthBarHeight}
          />
        )}
      </Container>
    </>
  );
};
