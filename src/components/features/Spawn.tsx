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
import { Clans } from "../../types";
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

export const SpawnSprite = ({
  clan,
  x,
  y,
}: {
  clan: Clans;
  x: number;
  y: number;
}) => {
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
  const ninjaTexture = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return AncientNinjaTexture;
      case Clans.Creepers:
        return CreeperNinjaTexture;
      case Clans.Synths:
        return SynthNinjaTexture;
      case Clans.Wildings:
        return WildingNinjaTexture;
      default:
        return CreeperNinjaTexture;
    }
  }, [clan]);
  const soheiTexture = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return AncientSoheiTexture;
      case Clans.Creepers:
        return CreeperSoheiTexture;
      case Clans.Synths:
        return SynthSoheiTexture;
      case Clans.Wildings:
        return WildingSoheiTexture;
      default:
        return CreeperSoheiTexture;
    }
  }, [clan]);
  const samuraiTexture = useMemo(() => {
    switch (clan) {
      case Clans.Ancients:
        return AncientSamuraiTexture;
      case Clans.Creepers:
        return CreeperSamuraiTexture;
      case Clans.Synths:
        return SynthSamuraiTexture;
      case Clans.Wildings:
        return WildingSamuraiTexture;
      default:
        return CreeperSamuraiTexture;
    }
  }, [clan]);

  const onSpawnClick: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      setActive(true);
    }, []);
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
                text="0"
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
                text="2"
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
                text="123"
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
