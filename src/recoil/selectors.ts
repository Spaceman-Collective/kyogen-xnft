import { selector } from "recoil";
import { gameStateAtom } from "./atoms";
import { Map } from "../types";

export const selectMapDims = selector({
  key: "selectMapDims",
  get: ({ get }) => {
    const gameState = get(gameStateAtom);
    if (!gameState) {
      return { height: 8, width: 8 }
    }
    const map = gameState.get_map() as Map;
    return map.tiles.reduce(
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
  }
});
