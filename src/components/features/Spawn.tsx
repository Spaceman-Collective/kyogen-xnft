import * as PIXI from "pixi.js";
import { Container, Sprite } from "react-pixi-fiber";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  FEATURE_LENGTH,
  TILE_LENGTH,
} from "../../constants";

import { useCallback, useMemo, useRef, useState } from "react";
import { SelectorToolTip } from "./SelectorToolTip";
import { WorldOverlay } from "../WorldOverlay";
import { NumberContainer } from "../NumberContainer";
import { Clans, UnitNames } from "../../types";
import {
  AncientNinjaTexture,
  AncientSamuraiTexture,
  AncientSoheiTexture,
  AncientSpawnTexture,
  CreeperNinjaTexture,
  CreeperSamuraiTexture,
  CreeperSoheiTexture,
  CreeperSpawnTexture,
  SynthNinjaTexture,
  SynthSamuraiTexture,
  SynthSoheiTexture,
  SynthSpawnTexture,
  WildingNinjaTexture,
  WildingSamuraiTexture,
  WildingSoheiTexture,
  WildingSpawnTexture,
} from "../../textures";
import { useRecoilValue } from "recoil";
import {
  selectCurrentPlayer,
  selectCurrentPlayerHand,
} from "../../recoil/selectors";
import { useSpawnUnit } from "../../hooks/useSpawnUnit";
import { calculateUnitPositionOnTileCoords } from "../../utils/map";
import { gameStateAtom, tilesAtomFamily } from "../../recoil";

export const Spawn = ({ tileId }: { tileId: string }) => {
  const tile = useRecoilValue(tilesAtomFamily(tileId));

  if (!tile || !tile.spawnable || !tile.clan) {
    return null;
  }
  return <SpawnSprite clan={tile.clan} tileX={tile.x} tileY={tile.y} />;
};

export const SpawnSprite = ({
  clan,
  tileX,
  tileY,
}: {
  clan: Clans;
  tileX: number;
  tileY: number;
}) => {
  const coords = calculateUnitPositionOnTileCoords(tileX, tileY);
  const player = useRecoilValue(selectCurrentPlayer);
  const playerHand = useRecoilValue(selectCurrentPlayerHand);
  const gameState = useRecoilValue(gameStateAtom);
  let spawnLocked = useRef(false).current;
  const [active, setActive] = useState(false);
  const spawnUnit = useSpawnUnit(BigInt(gameState!.get_tile_id(tileX, tileY)));
  const spawnTexture = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return AncientSpawnTexture;
      case Clans.Creepers:
        return CreeperSpawnTexture;
      case Clans.Synths:
        return SynthSpawnTexture;
      case Clans.Wildings:
        return WildingSpawnTexture;
      default:
        return CreeperSpawnTexture;
    }
  }, [clan]);
  const [ninjaTexture, ninjaUnitName, ninjaCardCount] = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return [
          AncientNinjaTexture,
          UnitNames.AncientNinja,
          playerHand[UnitNames.AncientNinja] ?? 0,
        ];
      case Clans.Creepers:
        return [
          CreeperNinjaTexture,
          UnitNames.CreeperNinja,
          playerHand[UnitNames.CreeperNinja] ?? 0,
        ];
      case Clans.Synths:
        return [
          SynthNinjaTexture,
          UnitNames.SynthNinja,
          playerHand[UnitNames.SynthNinja] ?? 0,
        ];
      case Clans.Wildings:
        return [
          WildingNinjaTexture,
          UnitNames.WildingNinja,
          playerHand[UnitNames.WildingNinja] ?? 0,
        ];
      default:
        return [CreeperNinjaTexture, UnitNames.CreeperNinja, 0];
    }
  }, [clan, playerHand]);
  const [soheiTexture, soheiUnitName, soheiCardCount] = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return [
          AncientSoheiTexture,
          UnitNames.AncientSohei,
          playerHand[UnitNames.AncientSohei] ?? 0,
        ];
      case Clans.Creepers:
        return [
          CreeperSoheiTexture,
          UnitNames.CreeperSohei,
          playerHand[UnitNames.CreeperSohei] ?? 0,
        ];
      case Clans.Synths:
        return [
          SynthSoheiTexture,
          UnitNames.SynthSohei,
          playerHand[UnitNames.SynthSohei] ?? 0,
        ];
      case Clans.Wildings:
        return [
          WildingSoheiTexture,
          UnitNames.WildingSohei,
          playerHand[UnitNames.WildingSohei] ?? 0,
        ];
      default:
        return [CreeperSoheiTexture, UnitNames.CreeperSohei, 0];
    }
  }, [clan, playerHand]);
  const [samuraiTexture, samuraiUnitName, samuraiCardCount] = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return [
          AncientSamuraiTexture,
          UnitNames.AncientSamurai,
          playerHand[UnitNames.AncientSamurai] ?? 0,
        ];
      case Clans.Creepers:
        return [
          CreeperSamuraiTexture,
          UnitNames.CreeperSamurai,
          playerHand[UnitNames.CreeperSamurai] ?? 0,
        ];
      case Clans.Synths:
        return [
          SynthSamuraiTexture,
          UnitNames.SynthSamurai,
          playerHand[UnitNames.SynthSamurai] ?? 0,
        ];
      case Clans.Wildings:
        return [
          WildingSamuraiTexture,
          UnitNames.WildingSamurai,
          playerHand[UnitNames.WildingSamurai] ?? 0,
        ];
      default:
        return [CreeperSamuraiTexture, UnitNames.CreeperSamurai, 0];
    }
  }, [clan, playerHand]);

  const onSpawnClick: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(
      (event) => {
        if (player?.clan !== clan) {
          // player should not be able to click on spawn that's not theirs
          return;
        }
        event.stopPropagation();
        setActive(true);
      },
      [clan, player?.clan]
    );
  const onDismiss: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback(() => {
      setActive(false);
    }, []);

  // Since the feature sprite should be centered within the tile, we will need to
  // offset it and any other relative graphics.
  const featureOffset = (TILE_LENGTH - FEATURE_LENGTH) / 2;

  return (
    <>
      {active && (
        // Container that detects clicks anywhere in the viewport outside of the `SelectorToolTip`
        // for dismissal
        <WorldOverlay onclick={onDismiss} />
      )}
      <Container x={coords.x} y={coords.y}>
        <Sprite
          height={FEATURE_LENGTH}
          width={FEATURE_LENGTH}
          // center within the tile
          x={featureOffset}
          y={featureOffset}
          texture={spawnTexture}
          onclick={onSpawnClick}
          interactive
        />
        {active && (
          <SelectorToolTip
            itemWidth={CARD_WIDTH}
            itemMaxHeight={CARD_WIDTH}
            x={featureOffset}
            y={featureOffset}
          >
            <Container>
              <Sprite
                texture={ninjaTexture}
                height={CARD_WIDTH}
                width={CARD_WIDTH}
                interactive
                onclick={async (e) => {
                  if (spawnLocked) {
                    // prevent additional spawns
                    return;
                  }
                  spawnLocked = true;
                  await spawnUnit(ninjaUnitName);
                  spawnLocked = false;
                }}
              />
              <NumberContainer
                fill={0x8f2a2a}
                stroke={0x371717}
                text={`${ninjaCardCount}`}
                x={CARD_WIDTH}
                y={CARD_HEIGHT}
              />
            </Container>
            <Container>
              <Sprite
                texture={samuraiTexture}
                height={CARD_WIDTH}
                width={CARD_WIDTH}
                interactive
                onclick={async (e) => {
                  if (spawnLocked) {
                    // prevent additional spawns
                    return;
                  }
                  spawnLocked = true;
                  await spawnUnit(samuraiUnitName);
                  spawnLocked = false;
                }}
              />
              <NumberContainer
                fill={0x8f2a2a}
                stroke={0x371717}
                text={`${samuraiCardCount}`}
                x={CARD_WIDTH}
                y={CARD_HEIGHT}
              />
            </Container>
            <Container>
              <Sprite
                texture={soheiTexture}
                height={CARD_WIDTH}
                width={CARD_WIDTH}
                interactive
                onclick={async (e) => {
                  if (spawnLocked) {
                    // prevent additional spawns
                    return;
                  }
                  spawnLocked = true;
                  await spawnUnit(soheiUnitName);
                  spawnLocked = false;
                }}
              />
              <NumberContainer
                fill={0x8f2a2a}
                stroke={0x371717}
                text={`${soheiCardCount}`}
                x={CARD_WIDTH}
                y={CARD_HEIGHT}
              />
            </Container>
          </SelectorToolTip>
        )}
      </Container>
    </>
  );
};
