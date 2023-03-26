import { selector, selectorFamily } from "recoil";
import {
  gameStateAtom,
  gameWallet,
  healerIdsAtom,
  healersAtomFamily,
  meteorIdsAtom,
  meteorsAtomFamily,
  playerIdsAtom,
  playersAtomFamily,
  selectedTileIdAtom,
  tileIdsAtom,
  tilesAtomFamily,
  troopsAtomFamily,
} from "./atoms";
import { Meteor, Player, Tile, Troop, UnitNames } from "../types";
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
        acc.height = Math.max(tile.y + 1, acc.height);
        acc.width = Math.max(tile.x + 1, acc.width);
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
    const selectedUnit = get(selectTroopFromSelectedTile);
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

export const selectTroopFromSelectedTile = selector({
  key: "selectUnitFromSelectedTile",
  get: ({ get }) => {
    const selectedTileId = get(selectedTileIdAtom);
    const selectedTile = get(tilesAtomFamily(selectedTileId));
    if (!selectedTile || !selectedTile.troop) return null;
    // must read from troop atom family, so that state can be decoupled
    return get(troopsAtomFamily(selectedTile.troop.id));
  },
});

export const selectTileFromTroopId = selectorFamily({
  key: "selectTileFromTroopId",
  get:
    (troopId: string) =>
    ({ get }) => {
      const tileIds = get(tileIdsAtom);
      const tiles = tileIds.map((id) => get(tilesAtomFamily(id))) as Tile[];

      return tiles.find((tile) => tile.troop?.id === troopId);
    },
});

export const selectMeteorFromSelectedTileId = selector({
  key: "selectStructureFromSelectedTileId",
  get: ({ get }) => {
    const gameState = get(gameStateAtom);
    if (!gameState) {
      return null;
    }
    const tileId = get(selectedTileIdAtom);
    const meteorIds = get(meteorIdsAtom);
    return (
      meteorIds
        .map((id) => get(meteorsAtomFamily(id)))
        .find(
          (meteor) =>
            meteor && tileId === gameState.get_tile_id(meteor.x, meteor.y)
        ) ?? null
    );
  },
});

export const selectMeteorXYMapping = selector({
  key: "selectMeteorMapping",
  get: ({ get }) => {
    const meteorIds = get(meteorIdsAtom);
    const meteors = meteorIds.map((id) => get(meteorsAtomFamily(id)));
    const mapping: Record<string, Meteor> = {};
    meteors.forEach((meteor) => {
      if (meteor) mapping[`${meteor.x},${meteor.y}`] = meteor;
    });
    return mapping;
  },
});

export const selectPlayerUnitsOnMeteors = selector({
  key: "selectPlayerUnitsOnMeteors",
  get: ({ get }) => {
    const meteorXyMapping = get(selectMeteorXYMapping);
    const currentPlayer = get(selectCurrentPlayer);
    const tileIds = get(tileIdsAtom);
    const res: Record<string, { meteor: Meteor; tile: Tile }> = {};
    tileIds.forEach((tileId) => {
      const tile = get(tilesAtomFamily(tileId));
      if (!tile) return;
      const playerHasTroopOnTile =
        tile.troop && tile.troop.player_id === currentPlayer?.id;
      const meteorOnTile = meteorXyMapping[`${tile.x},${tile.y}`];
      if (playerHasTroopOnTile && meteorOnTile) {
        res[tileId] = { meteor: meteorOnTile, tile };
      }
    });
    return res;
  },
});

// TODO clean this up
export const selectSelectedMeteorAndPlayerUnit = selector<
  [Meteor, Troop, string] | null
>({
  key: "selectSelectedMeteorAndPlayerUnit",
  get: ({ get }) => {
    const meteor = get(selectMeteorFromSelectedTileId);
    if (!meteor) {
      return null;
    }
    const currentPlayer = get(selectCurrentPlayer);
    const troop = get(selectTroopFromSelectedTile);
    if (troop?.player_id !== currentPlayer?.id) {
      return null;
    }
    const tileId = get(selectedTileIdAtom);
    return [meteor, troop, tileId] as [Meteor, Troop, string];
  },
});

export const selectAllStructures = selector({
  key: "selectAllStructures",
  get: ({ get }) => {
    const meteorIds = get(meteorIdsAtom);
    const meteors = meteorIds.map((id) => get(meteorsAtomFamily(id)));
    const healerIds = get(healerIdsAtom);
    const healers = healerIds.map((id) => get(healersAtomFamily(id)));
    const res = [...meteors, ...healers];

    return res;
  },
});
