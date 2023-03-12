import { Stage } from "react-pixi-fiber";
import { KyogenViewport } from "./PixiViewport";
import { TileMap } from "./TileMap";
import { useWindowSize } from "usehooks-ts";
import { useWorldDims } from "../hooks/useWorldDims";
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil";
import { SpawnLayer } from "./features/SpawnLayer";
import { TroopLayer } from "./units/TroopLayer";

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
          <SpawnLayer />
          <TroopLayer />
        </KyogenViewport>
      </BridgedRecoilRoot>
    </Stage>
  );
};
