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
