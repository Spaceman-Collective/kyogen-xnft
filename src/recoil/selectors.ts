import { selector, selectorFamily } from "recoil";
import {
  gameStateAtom,
  gameWallet,
  playerIdsAtom,
  playersAtomFamily,
  selectedTileIdAtom,
  selectedUnitAtom,
  tileIdsAtom,
  tilesAtomFamily,
} from "./atoms";
import { Player, Tile, UnitNames } from "../types";
import { playerColorPalette } from "../constants";
import { calculateDistance } from "../utils/map";

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

export const selectPlayerColor = selectorFamily({
  key: "selectPlayerColor",
  get:
    (playerId: string) =>
    ({ get }) => {
      const ids = get(playerIdsAtom);
      const index = ids.indexOf(playerId);
      return playerColorPalette[index] ?? 0x000000;
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

export const selectTilesWithEnemies = selector({
  key: "selectTilesWithEnemies",
  get: ({ get }) => {
    const currentPlayer = get(selectCurrentPlayer);
    const tileIds = get(tileIdsAtom);
    const tiles = tileIds.map((id) => get(tilesAtomFamily(id))) as Tile[];
    return tiles.filter(
      (tile) => tile.troop && tile.troop.player_id !== currentPlayer?.id
    );
  },
});

// TODO update this logic, it could be more performant by iterating over only attackable tiles
export const selectTilesWithEnemiesInSelectedUnitAttackRange = selector({
  key: "selectTilesWithEnemiesInSelectedUnitAttackRange",
  get: ({ get }) => {
    const selectedUnit = get(selectedUnitAtom);
    const selectedTileId = get(selectedTileIdAtom);
    const selectedTile = get(tilesAtomFamily(selectedTileId));
    const currentPlayer = get(selectCurrentPlayer);
    if (
      !selectedTile ||
      !selectedUnit ||
      selectedUnit.id !== selectedTile.troop?.id ||
      selectedUnit.player_id !== currentPlayer?.id
    ) {
      return [];
    }
    const tilesWithEnemies = get(selectTilesWithEnemies);
    return tilesWithEnemies.filter(
      (tile) =>
        calculateDistance([selectedTile.x, selectedTile.y], [tile.x, tile.y]) <=
        Number(selectedUnit.attack_range)
    );
  },
});
