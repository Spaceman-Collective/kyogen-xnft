import { Viewport } from "pixi-viewport";
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
import { MoveHighlight } from "./MoveHighlight";

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

  const onDragStart: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();

      const sprite = event.currentTarget as PIXI.DisplayObject;
      const viewport = sprite.parent.parent as Viewport;
      setStartTile(
        calculateTileCoords(
          normalizeGlobalPointFromViewport(viewport, event.global)
        )
      );
      sprite.alpha = 0.5;
      setDragging(true);
    }, []);

  const onDragEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        event.stopPropagation();
        const sprite = event.currentTarget as PIXI.DisplayObject;
        const viewport = sprite.parent.parent as Viewport;
        sprite.alpha = 1;
        setDragging(false);
        // snap sprite to tile
        const coords = calculateTileCoords(
          normalizeGlobalPointFromViewport(viewport, event.global)
        );
        const distance = calculateDistance(startTile!, coords);
        const finalPosition = calculateUnitPositionOnTileCoords(
          ...(distance <= movement ? coords : startTile!)
        );
        sprite.position = finalPosition;
      },
      [movement, startTile]
    );

  const onDragMove: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        event.stopPropagation();
        const sprite = event.currentTarget as PIXI.DisplayObject;
        if (dragging) {
          const viewport = sprite.parent.parent as Viewport;
          const position = normalizeGlobalPointFromViewport(
            viewport,
            event.global
          );
          sprite.x = position.x - TILE_LENGTH / 2;
          sprite.y = position.y - TILE_LENGTH / 2;
        }
      },
      [dragging]
    );

  return (
    <Container>
      <MoveHighlight
        movement={movement}
        startTile={startTile}
        tiles={moveable}
      />
      <Sprite
        texture={typeof src === "string" ? PIXI.Texture.from(src) : src}
        onpointerdown={onDragStart}
        onpointerup={onDragEnd}
        onpointermove={onDragMove}
        // TODO fix this. Naively setting dims to same as tile to skip additional coord calcs.
        height={TILE_LENGTH}
        width={TILE_LENGTH}
        interactive
        x={initialX}
        y={initialY}
      />
    </Container>
  );
};
