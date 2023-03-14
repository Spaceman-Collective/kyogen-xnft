import { useRecoilTransaction_UNSTABLE } from "recoil";
import { Player, Tile, Troop } from "../types";
import {
  gameStateAtom,
  playerIdsAtom,
  playersAtomFamily,
  tileIdsAtom,
  tilesAtomFamily,
  troopIdsAtom,
  troopsAtomFamily,
} from "./atoms";

export const useUpdateTiles = (updateIdList: boolean) =>
  useRecoilTransaction_UNSTABLE<[Tile[]]>(
    ({ get, set }) =>
      (tiles) => {
        const ids = tiles.map((tile) => {
          const tileId = get(gameStateAtom)?.get_tile_id(tile.x, tile.y);
          if (!tileId) {
            return null;
          }
          set(tilesAtomFamily(tileId), tile);
          return tileId;
        });
        if (updateIdList) {
          set(tileIdsAtom, ids.filter((x) => !!x) as string[]);
        }
      },
    [updateIdList]
  );

export const useUpdatePlayers = () =>
  useRecoilTransaction_UNSTABLE<
    [{ updateIdList?: boolean; players: Player[] }]
  >(
    ({ set }) =>
      ({ players, updateIdList }) => {
        const ids = players.map((player) => {
          set(playersAtomFamily(player.id), player);
          return player.id;
        });
        if (updateIdList) {
          set(playerIdsAtom, ids);
        }
      },
    []
  );

export const useUpdateTroops = () =>
  useRecoilTransaction_UNSTABLE<
    [{ appendToIdList?: boolean; troops: Troop[]; updateIdList?: boolean }]
  >(
    ({ set }) =>
      ({ appendToIdList, troops, updateIdList }) => {
        const ids = troops.map((troop) => {
          set(troopsAtomFamily(troop.id), troop);
          return troop.id;
        });
        if (appendToIdList) {
          set(troopIdsAtom, (cur) => [...cur, ...ids]);
        }
        if (updateIdList) {
          set(troopIdsAtom, ids);
        }
      },
    []
  );
