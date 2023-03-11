import { selector } from "recoil";
import { gameStateAtom, gameWallet } from "./atoms";
import { Map, Player, UnitNames } from "../types";

export const selectTiles = selector({
  key: "selectTiles",
  get: ({ get }) =>
    (get(gameStateAtom)?.get_map() as Map | undefined)?.tiles ?? [],
});

export const selectCurrentPlayer = selector<Player | null>({
  key: "selectCurrentPlayer",
  get: ({ get }) => {
    const wallet = get(gameWallet);
    const gameState = get(gameStateAtom);
    const players = gameState?.get_players() as Player[];
    return (
      players.find((player) => player.owner === wallet?.publicKey.toString()) ??
      null
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
