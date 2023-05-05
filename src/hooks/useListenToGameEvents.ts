import {
  gameFeedAtom,
  playPhaseAtom,
  gameIdAtom,
  playersAtomFamily,
  troopsAtomFamily,
} from "@/recoil";
import { useCallback, useEffect } from "react";
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from "recoil";
import {
  useUpdateMeteors,
  useUpdatePlayers,
  useUpdateTiles,
  useUpdateTroops,
} from "../recoil/transactions";
import { Player, Tile, Troop, KyogenEvents, Meteor } from "../types";
import { useStatelessSdk } from "./useStatelessSdk";

const useListenToGameEvents = () => {
  const kyogenSdk = useStatelessSdk();
  const gameInstance = useRecoilValue(gameIdAtom);
  const updateTiles = useUpdateTiles(false);
  const updatePlayers = useUpdatePlayers();
  const setGameFeed = useSetRecoilState(gameFeedAtom);
  const setPlayPhase = useSetRecoilState(playPhaseAtom);
  const updateTroops = useUpdateTroops();
  const updateMeteors = useUpdateMeteors();
  const getPlayerById = useRecoilCallback(
    ({ snapshot }) =>
      (playerId: string) => {
        return snapshot.getLoadable(playersAtomFamily(playerId))
          .contents as Player | null;
      },
    []
  );
  const getTroopById = useRecoilCallback(
    ({ snapshot }) =>
      (troopId: string) => {
        return snapshot.getLoadable(troopsAtomFamily(troopId))
          .contents as Troop | null;
      },
    []
  );

  const handleEvent = useCallback(
    async (event: KyogenEvents) => {
      console.log("EVENT: ", event);
      const timestamp = Date.now();

      switch (event.name) {
        case "NewPlayer":
          const newPlayer = kyogenSdk.get_player_json(
            event.player.data,
            BigInt(event.player.id)
          ) as Player;
          updatePlayers({ appendToIdList: true, players: [newPlayer] });
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [newPlayer],
              msg: `a new player just joined clan ${event.clan}`,
              timestamp,
            },
          ]);
          break;
        case "GameStateChanged":
          // TODO: Update game state and pull from there
          if (event.newState === "play") {
            setPlayPhase("Play");
          } else if (event.newState === "paused") {
            setPlayPhase("Paused");
          } else if (event.newState === "lobby") {
            setPlayPhase("Lobby");
          } else if (event.newState === "finished") {
            setPlayPhase("Finished");
          }
          break;
        case "SpawnClaimed":
          // TODO:
          break;
        case "UnitSpawned":
          console.log("UnitSpawned", event);
          const tile = kyogenSdk.get_tile_json(
            event.tile.data,
            BigInt(event.tile.id)
          ) as Tile;
          if (tile.troop) {
            updateTroops({ appendToIdList: true, troops: [tile.troop] });
          }
          updateTiles([tile]);

          const spawner = kyogenSdk.get_player_json(
            event.player.data,
            BigInt(event.player.id)
          ) as Player;
          updatePlayers({
            players: [spawner],
          });
          const spawned = kyogenSdk.get_troop_json(
            event.unit.data,
            BigInt(event.unit.id)
          ) as Troop;
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [spawner],
              msg: `%1% spawned a ${spawned.name}`,
              timestamp,
            },
          ]);
          break;
        case "UnitMoved":
          console.log("UnitMoved", event);
          // TODO can we make BigInt from BN?

          const fromTile = kyogenSdk.get_tile_json(
            event.from.data,
            BigInt(event.from.id)
          );
          const toTile = kyogenSdk.get_tile_json(
            event.to.data,
            BigInt(event.to.id)
          );

          const troop = kyogenSdk.get_troop_json(
            event.unit.data,
            BigInt(event.unit.id)
          ) as Troop;

          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [getPlayerById(troop.player_id) as Player],
              msg: `player moved ${troop.name} from [${fromTile.x},${fromTile.y}] to [${toTile.x},${toTile.y}]`,
              timestamp,
            },
          ]);

          const movedTiles = [fromTile, toTile] as Tile[];
          const movedTroops = movedTiles
            .map((t) => t.troop)
            .filter((x) => !!x) as Troop[];
          updateTroops({ troops: movedTroops });
          updateTiles(movedTiles);
          break;
        case "UnitAttacked":
          console.log("UNIT ATTACKED", event);
          const defendingTroop = kyogenSdk.get_troop_json(
            event.defender.data,
            BigInt(event.defender.id)
          ) as Troop;
          const defendingTroopPreAttack = getTroopById(defendingTroop.id);
          const attackingTroop = kyogenSdk.get_troop_json(
            event.attacker.data,
            BigInt(event.attacker.id)
          ) as Troop;
          const damage =
            Number(defendingTroopPreAttack?.health ?? 0) -
            Number(defendingTroop.health);
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [
                getPlayerById(attackingTroop.player_id) as Player,
                getPlayerById(defendingTroop.player_id) as Player,
              ],
              msg: `%1% (${attackingTroop.name}) attacked %2% ${
                Number(defendingTroop.health) <= 0
                  ? `killing (${defendingTroop.name})`
                  : `(${defendingTroop.name}) dealing ${damage} damage`
              }`,
              timestamp,
            },
          ]);
          const defendingTiles = [
            kyogenSdk.get_tile_json(event.tile.data, BigInt(event.tile.id)),
          ];
          updateTroops({ troops: [defendingTroop, attackingTroop] });
          updateTiles(defendingTiles);
          break;

        case "MeteorMined":
          // Get the exsting meteor by ID from recoil state. Then update with the slot from the event.
          console.log("getting meteor by ID", event.meteor.id);
          const meteor = kyogenSdk.get_structure_json(
            event.meteor.data,
            BigInt(event.meteor.id)
          ) as Meteor;
          const miner = kyogenSdk.get_player_json(
            event.player.data,
            BigInt(event.player.id)
          ) as Player;
          updateMeteors([meteor]);
          updatePlayers({ players: [miner] });
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [miner],
              msg: `%1% mined ${meteor.structure.Meteor.solarite_per_use} solarite`,
              timestamp,
            },
          ]);
          break;
        case "PortalUsed":
          break;
      }
    },
    [
      getPlayerById,
      getTroopById,
      kyogenSdk,
      setGameFeed,
      setPlayPhase,
      updateMeteors,
      updatePlayers,
      updateTiles,
      updateTroops,
    ]
  );

  useEffect(() => {
    if (!gameInstance) {
      return;
    }
    const _source = new EventSource(
      `https://dominari.xyz/game/${gameInstance}`
    );
    _source.onmessage = (e) => {
      console.log("event  ", e);
      const parsedEvent = JSON.parse(e.data);
      handleEvent(parsedEvent);
    };
    return () => {
      _source.close();
    };
  }, [gameInstance, handleEvent]);
};

export default useListenToGameEvents;
