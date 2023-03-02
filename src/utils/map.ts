import * as PIXI from "pixi.js";
import { TILE_LENGTH, TILE_SPACING } from "../constants";

/**
 * Calculates which tile i,j the coordinates are at. x and y are respective to the Stage.
 * @param x
 * @param y
 */
export const calculateTileCoords = (point: PIXI.Point): [number, number] => {
  const tileBoundary = TILE_LENGTH + TILE_SPACING / 2;
  const i = Math.floor(point.x / tileBoundary);
  const j = Math.floor(point.y / tileBoundary);
  return [i, j];
};

/**
 * @param i
 * @param j
 */
export const calculateUnitPositionOnTileCoords = (
  i: number,
  j: number
): PIXI.Point => {
  const x = i * TILE_LENGTH + i * TILE_SPACING;
  const y = j * TILE_LENGTH + j * TILE_SPACING;
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
  j: number
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
export const calculateCenteredPositionFromCenter = (i: number, j: number) => {
  const start = calculateUnitPositionOnTileCoords(i, j);
  const offsetX = TILE_LENGTH / 2;
  const offsetY = TILE_LENGTH / 2;

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
