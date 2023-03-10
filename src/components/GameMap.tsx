import { Stage } from "react-pixi-fiber";
import { KyogenViewport } from "./PixiViewport";
import { TileMap } from "./TileMap";
import { UnitSprite } from "./units/UnitSprite";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import { useWindowSize } from "usehooks-ts";
import { SpawnSprite } from "./features/Spawn";
import { useWorldDims } from "../hooks/useWorldDims";
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil";

export const GameMap = () => {
  const BridgedRecoilRoot = useRecoilBridgeAcrossReactRoots_UNSTABLE();
  const { height: worldHeight, width: worldWidth } = useWorldDims();
  const windowSize = useWindowSize();
  const stageHeight = Math.min(windowSize.height, worldHeight);
  const stageWidth = Math.min(windowSize.width, worldWidth);

  return (
    <Stage
      options={{
        antialias: true,
        autoDensity: true,
        resolution: 2,
        backgroundColor: 0xeae6d5,
        height: stageHeight,
        width: stageWidth,
      }}
    >
      <BridgedRecoilRoot>
        <KyogenViewport
          screenHeight={stageHeight}
          screenWidth={stageWidth}
          worldHeight={worldHeight}
          worldWidth={worldWidth}
        >
          <TileMap />
          <UnitSprite initialX={0} initialY={0} movement={1} health={10} />
          <SpawnSprite
            x={TILE_LENGTH + TILE_SPACING}
            y={TILE_LENGTH + TILE_SPACING}
          />
          <SpawnSprite
            x={(TILE_LENGTH + TILE_SPACING) * 3}
            y={(TILE_LENGTH + TILE_SPACING) * 3}
          />
        </KyogenViewport>
      </BridgedRecoilRoot>
    </Stage>
  );
};
