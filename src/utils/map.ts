import { Viewport } from "pixi-viewport";
import * as PIXI from "pixi.js";
import { TILE_LENGTH, TILE_SPACING } from "../constants";

/**
 * Normalize Stage Point based on viewport transformation
 */
export const normalizeGlobalPointFromViewport = (
  viewport: Viewport,
  point: PIXI.Point
) => {
  return new PIXI.Point(
    point.x - (viewport.lastViewport?.x ?? 0),
    point.y - (viewport.lastViewport?.y ?? 0)
  );
};

/**
 * Calculates which tile i,j the coordinates are at. x and y are respective to the Stage.
 * @param x
 * @param y
 */
export const calculateTileCoords = (
  point: PIXI.Point,
  scaleX = 1,
  scaleY = 1
): [number, number] => {
  const tileBoundary = TILE_LENGTH + TILE_SPACING / 2;
  const i = Math.floor(point.x / (tileBoundary * scaleX));
  const j = Math.floor(point.y / (tileBoundary * scaleY));
  return [i, j];
};

/**
 * Calculate the counter clockwise rotation between 2 points, where source is treated as the origin.
 * Value is in Radians.
 * @param source
 * @param dest
 * @returns
 */
export const calculateRotationFromTileCoords = (
  source: [number, number],
  dest: [number, number]
) => {
  const diffX = dest[0] - source[0];
  const diffY = source[1] - dest[1];
  return Math.atan2(diffY, diffX);
};

/**
 * Returns the top left Point of a Tile based on the Viewport.
 * @param i
 * @param j
 */
export const calculateUnitPositionOnTileCoords = (
  i: number,
  j: number,
  scaleX = 1,
  scaleY = 1,
): PIXI.Point => {
  const normalizedTileWidth = (TILE_LENGTH + TILE_SPACING) * scaleX;
  const normslizedTileHeight = (TILE_LENGTH + TILE_SPACING) * scaleY;
  const x = i * normalizedTileWidth;
  const y = j * normslizedTileHeight;
  return new PIXI.Point(x, y);
};

/**
 * Based on dims of object, get the position for the object to be centered on tile.
 * Assumes drawing starts from top left of plane.
 * @param height
 * @param width
 * @param i
 * @param j
 */
export const calculateCenteredPositionFromTopLeft = (
  height: number,
  width: number,
  i: number,
  j: number,
) => {
  const start = calculateUnitPositionOnTileCoords(i, j);
  const _height = Math.min(height, TILE_LENGTH);
  const _width = Math.min(width, TILE_LENGTH);

  const offsetX = Math.floor((TILE_LENGTH - _height) / 2);
  const offsetY = Math.floor((TILE_LENGTH - _width) / 2);

  return new PIXI.Point(start.x + offsetX, start.y + offsetY);
};

/**
 * Based on dims of object, get the position for the object to be centered on tile.
 * Assumes drawing starts from center of object.
 * @param height
 * @param width
 * @param i
 * @param j
 */
export const calculateCenteredPositionFromCenter = (i: number, j: number, scaleX = 1, scaleY = 1) => {
  const start = calculateUnitPositionOnTileCoords(i, j, scaleX, scaleY);
  const offsetX = TILE_LENGTH / 2 * scaleX;
  const offsetY = TILE_LENGTH / 2 * scaleY;

  return new PIXI.Point(start.x + offsetX, start.y + offsetY);
};

/**
 * Calculate the movement distance between 2 tile locations
 * @param start
 * @param end
 * @returns
 */
// let distance:f64 = (((to_location.x as f64 - from_location.x as f64).powf(2_f64) + (to_location.y as f64 - from_location.y as f64).powf(2_f64)) as f64).sqrt();
export const calculateDistance = (
  start: [number, number],
  end: [number, number]
) => {
  return Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);
};

/**
 * Calculate list of tile coordinates that are moveable, based on movement
 * @param start
 * @param end
 * @returns
 */
export const getMoveableTiles = (
  start: [number, number],
  movement: number,
  maxX: number,
  maxY: number
) => {
  const initX = start[0];
  const initY = start[1];
  const coords = [];
  for (
    let i = Math.max(initX - movement, 0);
    i <= Math.min(initX + movement, maxX);
    i++
  ) {
    for (
      let j = Math.max(initY - movement, 0);
      j <= Math.min(initY + movement, maxY);
      j++
    ) {
      if (i === start[0] && j === start[1]) {
        // can skip the starting tile
        continue;
      }
      const coord: [number, number] = [i, j];
      if (calculateDistance(start, coord) <= movement) {
        coords.push(coord);
      }
    }
  }
  return coords;
};
