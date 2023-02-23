import * as PIXI from "pixi.js";
import { Sprite } from "react-pixi-fiber";
import { TILE_LENGTH } from "../constants";
import {
  calculateTileCoords,
  calculateUnitPositionOnTileCoords,
} from "../utils/map";

interface Draggable extends PIXI.DisplayObject {
  dragging: boolean;
}

const onDragStart: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> = (
  event
) => {
  event.stopPropagation();

  const sprite = event.currentTarget as Draggable;
  sprite.alpha = 0.5;
  sprite.dragging = true;
};
const onDragEnd: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> = (
  event
) => {
  event.stopPropagation();
  const sprite = event.currentTarget as Draggable;
  sprite.alpha = 1;
  sprite.dragging = false;
  // snap sprite to tile
  const coords = calculateTileCoords(event.global);
  const finalPosition = calculateUnitPositionOnTileCoords(...coords);
  sprite.position = finalPosition;
};
const onDragMove: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> = (
  event
) => {
  event.stopPropagation();
  const sprite = event.currentTarget as Draggable;
  if (sprite.dragging) {
    sprite.x = event.globalX - TILE_LENGTH / 2;
    sprite.y = event.globalY - TILE_LENGTH / 2;
  }
};

export const UnitSprite = ({
  src,
}: {
  src: PIXI.Texture<PIXI.Resource> | string;
}) => {
  return (
    <Sprite
      // TODO Creeper sprite should drag over the map, not with it
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
  );
};
