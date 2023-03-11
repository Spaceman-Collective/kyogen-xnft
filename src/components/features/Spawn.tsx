import * as PIXI from "pixi.js";
import { Container, Sprite } from "react-pixi-fiber";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  FEATURE_LENGTH,
  TILE_LENGTH,
} from "../../constants";

import { useCallback, useMemo, useState } from "react";
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

export const SpawnSprite = ({
  clan,
  x,
  y,
}: {
  clan: Clans;
  x: number;
  y: number;
}) => {
  const player = useRecoilValue(selectCurrentPlayer);
  const playerHand = useRecoilValue(selectCurrentPlayerHand);
  const [active, setActive] = useState(false);
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
  const [ninjaTexture, ninjaCardCount] = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return [AncientNinjaTexture, playerHand[UnitNames.AncientNinja] ?? 0];
      case Clans.Creepers:
        return [CreeperNinjaTexture, playerHand[UnitNames.CreeperNinja] ?? 0];
      case Clans.Synths:
        return [SynthNinjaTexture, playerHand[UnitNames.SynthNinja] ?? 0];
      case Clans.Wildings:
        return [WildingNinjaTexture, playerHand[UnitNames.WildingNinja] ?? 0];
      default:
        return [CreeperNinjaTexture, 0];
    }
  }, [clan, playerHand]);
  const [soheiTexture, soheiCardCount] = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return [AncientSoheiTexture, playerHand[UnitNames.AncientSohei] ?? 0];
      case Clans.Creepers:
        return [CreeperSoheiTexture, playerHand[UnitNames.CreeperSohei] ?? 0];
      case Clans.Synths:
        return [SynthSoheiTexture, playerHand[UnitNames.SynthSohei] ?? 0];
      case Clans.Wildings:
        return [WildingSoheiTexture, playerHand[UnitNames.WildingSohei] ?? 0];
      default:
        return [CreeperSoheiTexture, 0];
    }
  }, [clan, playerHand]);
  const [samuraiTexture, samuraiCardCount] = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return [
          AncientSamuraiTexture,
          playerHand[UnitNames.AncientSamurai] ?? 0,
        ];
      case Clans.Creepers:
        return [
          CreeperSamuraiTexture,
          playerHand[UnitNames.CreeperSamurai] ?? 0,
        ];
      case Clans.Synths:
        return [SynthSamuraiTexture, playerHand[UnitNames.SynthSamurai] ?? 0];
      case Clans.Wildings:
        return [
          WildingSamuraiTexture,
          playerHand[UnitNames.WildingSamurai] ?? 0,
        ];
      default:
        return [CreeperSamuraiTexture, 0];
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
      <Container x={x} y={y}>
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
