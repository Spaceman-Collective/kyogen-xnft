import {
  gameFeedAtom,
  playPhaseAtom,
  gameIdAtom,
  playersAtomFamily,
  troopsAtomFamily,
  registryId,
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
  const registry = useRecoilValue(registryId);
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
          const newPlayer = kyogenSdk.get_player_json_2(
            event.data.player.data as string,
            BigInt(event.data.player.id),
            registry
          ) as Player;
          updatePlayers({ appendToIdList: true, players: [newPlayer] });
          setGameFeed((curr) => [
            ...curr,
            {
              type: event.name,
              players: [newPlayer],
              msg: `a new player just joined clan ${event.data.clan}`,
              timestamp,
            },
          ]);
          break;
        case "GameStateChanged":
          // TODO: Update game state and pull from there
          if (event.data.newState === "play") {
            setPlayPhase("Play");
          } else if (event.data.newState === "paused") {
            setPlayPhase("Paused");
          } else if (event.data.newState === "lobby") {
            setPlayPhase("Lobby");
          } else if (event.data.newState === "finished") {
            setPlayPhase("Finished");
          }
          break;
        case "SpawnClaimed":
          // TODO:
          break;
        case "UnitSpawned":
          console.log("UnitSpawned", event);
          const tile = kyogenSdk.get_tile_json_2(
            event.data.tile.data as string,
            BigInt(event.data.tile.id),
            registry,
            event.data.unit.data
          ) as Tile;
          if (tile.troop) {
            updateTroops({ appendToIdList: true, troops: [tile.troop] });
          }
          updateTiles([tile]);

          const spawner = kyogenSdk.get_player_json_2(
            event.data.player.data,
            BigInt(event.data.player.id),
            registry
          ) as Player;
          updatePlayers({
            players: [spawner],
          });
          const spawned = kyogenSdk.get_troop_json_2(
            event.data.unit.data,
            BigInt(event.data.unit.id),
            registry
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
          console.log(registry);
          const fromTile = kyogenSdk.get_tile_json_2(
            event.data.from.data as string,
            BigInt(event.data.from.id),
            registry,
            ""
          );
          console.log(registry);
          console.log("From Tile: ", fromTile);
          const toTile = kyogenSdk.get_tile_json_2(
            event.data.to.data as string,
            BigInt(event.data.to.id),
            registry,
            event.data.unit.data
          );
          console.log(registry);
          console.log(toTile);
          const troop = kyogenSdk.get_troop_json_2(
            event.data.unit.data as string,
            BigInt(event.data.unit.id),
            registry
          ) as Troop;
          console.log(troop);
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
          const defendingTroop = kyogenSdk.get_troop_json_2(
            event.data.defender.data,
            BigInt(event.data.defender.id),
            registry
          ) as Troop;
          const defendingTroopPreAttack = getTroopById(defendingTroop.id);
          const attackingTroop = kyogenSdk.get_troop_json_2(
            event.data.attacker.data,
            BigInt(event.data.attacker.id),
            registry
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
            kyogenSdk.get_tile_json_2(
              event.data.tile.data,
              BigInt(event.data.tile.id),
              registry,
              event.data.defender.data
            )
          ];
          updateTroops({ troops: [defendingTroop, attackingTroop] });
          updateTiles(defendingTiles);
          break;

        case "MeteorMined":
          // Get the exsting meteor by ID from recoil state. Then update with the slot from the event.
          console.log("getting meteor by ID", event.data.meteor.id);
          const meteor = kyogenSdk.get_structure_json_2(
            event.data.meteor.data,
            BigInt(event.data.meteor.id),
            registry
          ) as Meteor;
          const miner = kyogenSdk.get_player_json_2(
            event.data.player.data,
            BigInt(event.data.player.id),
            registry
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
      const parsedEvent = JSON.parse(e.data)
      if (parsedEvent === "connected") {
        return;
      }
      // event.data seems to be double stringified, so much double parse.
      handleEvent(parsedEvent);
    };
    return () => {
      _source.close();
    };
  }, [gameInstance, handleEvent]);
};

export default useListenToGameEvents;
