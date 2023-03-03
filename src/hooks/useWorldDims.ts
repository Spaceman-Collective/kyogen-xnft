import { useMemo } from "react";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import { useGameConfig } from "../context/GameConfigContext";

/**
 * Get the height and width of the world based ont the map's dimensions.
 */
export const useWorldDims = () => {
  const { height, width } = useGameConfig();

  return useMemo(
    () => ({
      height: height * TILE_LENGTH + TILE_SPACING * height,
      width: width * TILE_LENGTH + TILE_SPACING * width,
    }),
    [height, width]
  );
};
