import { useMemo } from "react";
import * as PIXI from "pixi.js";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import {
  calculateCenteredPositionFromCenter,
  calculateCenteredPositionFromTopLeft,
} from "../utils/map";
import { Circle, RoundedRect } from "./PixiComponents";

export const MoveHighlight = ({
  tiles,
  movement,
  startTile,
}: {
  movement: number;
  tiles: [number, number][];
  startTile: [number, number] | null;
}) => {
  const moveRectLength = useMemo(
    () => (movement * 2 + 0.5) * TILE_LENGTH + movement * 2 * TILE_SPACING,
    [movement]
  );
  const moveRectPosition = useMemo(() => {
    if (!startTile) {
      return new PIXI.Point();
    }
    const pt = calculateCenteredPositionFromTopLeft(
      moveRectLength,
      moveRectLength,
      ...startTile
    );
    const offset = (moveRectLength - TILE_LENGTH) / 2;
    return pt.set(pt.x - offset, pt.y - offset);
  }, [moveRectLength, startTile]);

  if (!tiles.length) {
    return null;
  }
  return (
    <>
      <RoundedRect
        height={moveRectLength}
        width={moveRectLength}
        x={moveRectPosition.x}
        y={moveRectPosition.y}
        fill={0x999084}
        alpha={0.3}
        radius={moveRectLength / 3}
      />
      {tiles.map((coords, index) => {
        const radius = 14;
        const position = calculateCenteredPositionFromCenter(...coords);
        return (
          <Circle
            key={index}
            radius={radius}
            x={position.x}
            y={position.y}
            fill={0xf1eeea}
          />
        );
      })}
    </>
  );
};
