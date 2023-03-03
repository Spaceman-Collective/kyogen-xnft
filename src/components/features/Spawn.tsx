import * as PIXI from "pixi.js";
import { Container, Sprite } from "react-pixi-fiber";
import {
  CARD_WIDTH,
  FEATURE_LENGTH,
  TILE_LENGTH,
} from "../../constants";
import CreeperSpawn from "../../../public/building_spawn_creepers_2x.webp";
import CreeperNinja from "../../../public/tile_creeper_ninja_2x.webp";
import CreeperSohei from "../../../public/tile_creeper_sohei_2x.webp";
import CreeperSamurai from "../../../public/tile_creeper_samurai_2x.webp";
import { useCallback, useState } from "react";
import { SelectorToolTip } from "./SelectorToolTip";
import { WorldOverlay } from "../WorldOverlay";

const CreeperSpawnTexture = PIXI.Texture.from(CreeperSpawn.src);
const CreeperNinjaTexture = PIXI.Texture.from(CreeperNinja.src);
const CreeperSoheiTexture = PIXI.Texture.from(CreeperSohei.src);
const CreeperSamuraiTexture = PIXI.Texture.from(CreeperSamurai.src);

export const SpawnSprite = ({ x, y }: { x: number; y: number }) => {
  const [active, setActive] = useState(false);

  const onSpawnClick: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
      event.stopPropagation();
      setActive(true);
    }, []);
  const onDismiss: PIXI.FederatedEventHandler<PIXI.FederatedPointerEvent> =
    useCallback((event) => {
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
          texture={CreeperSpawnTexture}
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
            <Sprite
              texture={CreeperNinjaTexture}
              height={CARD_WIDTH}
              width={CARD_WIDTH}
            />
            <Sprite
              texture={CreeperSamuraiTexture}
              height={CARD_WIDTH}
              width={CARD_WIDTH}
            />
            <Sprite
              texture={CreeperSoheiTexture}
              height={CARD_WIDTH}
              width={CARD_WIDTH}
            />
          </SelectorToolTip>
        )}
      </Container>
    </>
  );
};
