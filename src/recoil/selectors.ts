import { selector } from "recoil";
import { gameStateAtom } from "./atoms";
import { Map } from "../types";

export const selectTiles = selector({
  key: "selectTiles",
  get: ({ get }) =>
    (get(gameStateAtom)?.get_map() as Map | undefined)?.tiles ?? [],
});

export const selectMapDims = selector({
  key: "selectMapDims",
  get: ({ get }) => {
    const tiles = get(selectTiles);
    return tiles.reduce(
      (acc, tile) => {
        if (tile.y >= acc.height) {
          acc.height = tile.y + 1;
        }
        if (tile.x >= acc.width) {
          acc.width = tile.x + 1;
        }

        return acc;
      },
      { height: 0, width: 0 }
    );
  },
});
