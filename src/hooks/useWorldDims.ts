import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import { selectMapDims } from "../recoil/selectors";

/**
 * Get the height and width of the world based ont the map's dimensions.
 */
export const useWorldDims = () => {
  const { height, width } = useRecoilValue(selectMapDims);

  return useMemo(
    () => ({
      height: height * TILE_LENGTH + TILE_SPACING * height,
      width: width * TILE_LENGTH + TILE_SPACING * width,
    }),
    [height, width]
  );
};
