import * as PIXI from "pixi.js";
import { useCallback, useMemo, useState } from "react";
import { Container, Sprite } from "react-pixi-fiber";
import { TILE_LENGTH } from "../constants";
import {
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
  calculateDistance,
  getMoveableTiles,
} from "../utils/map";
import { MoveHighlight } from "./MoveHighlight";

export const UnitSprite = ({
  src,
  movement,
}: {
  src: PIXI.Texture<PIXI.Resource> | string;
  movement: number;
}) => {
  const [dragging, setDragging] = useState(false);
  const [startTile, setStartTile] = useState<[number, number] | null>(null);
  const moveable = useMemo(
    () =>
      dragging && startTile ? getMoveableTiles(startTile, movement, 8, 8) : [],
    [dragging, movement, startTile]
  );

  const onDragStart: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();

      const sprite = event.currentTarget as PIXI.DisplayObject;
      setStartTile(calculateTileCoords(event.global));
      sprite.alpha = 0.5;
      setDragging(true);
    }, []);

  const onDragEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        event.stopPropagation();
        const sprite = event.currentTarget as PIXI.DisplayObject;
        sprite.alpha = 1;
        setDragging(false);
        // snap sprite to tile
        const coords = calculateTileCoords(event.global);
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
          sprite.x = event.globalX - TILE_LENGTH / 2;
          sprite.y = event.globalY - TILE_LENGTH / 2;
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
        x={0}
        y={0}
      />
    </Container>
  );
};
