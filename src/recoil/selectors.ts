import { selector } from "recoil";
import {
  gameStateAtom,
  gameWallet,
  playerIdsAtom,
  playersAtomFamily,
  tileIdsAtom,
  tilesAtomFamily,
} from "./atoms";
import { Player, Tile, UnitNames } from "../types";

export const selectCurrentPlayer = selector<Player | null>({
  key: "selectCurrentPlayer",
  get: ({ get }) => {
    const wallet = get(gameWallet);
    const ids = get(playerIdsAtom);
    const players = ids.map((id) => get(playersAtomFamily(id)));
    return (
      players.find(
        (player) => player && player.owner === wallet?.publicKey.toString()
      ) ?? null
    );
  },
});

export const selectCurrentPlayerHand = selector<Record<UnitNames, number>>({
  key: "selectCurrentPlayerHand",
  get: ({ get }) => {
    const player = get(selectCurrentPlayer);
    const gameState = get(gameStateAtom);
    if (!player || !gameState) {
      return {} as Record<UnitNames, number>;
    }

    return player.cards.reduce((acc, c) => {
      const name = gameState.get_blueprint_name(c) as UnitNames;
      acc[name] = acc[name] ? acc[name] + 1 : 1;
      return acc;
    }, {} as Record<UnitNames, number>);
  },
});

export const selectMapDims = selector({
  key: "selectMapDims",
  get: ({ get }) => {
    const tileIds = get(tileIdsAtom);
    const tiles = tileIds.map((id) => get(tilesAtomFamily(id))) as Tile[];
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
