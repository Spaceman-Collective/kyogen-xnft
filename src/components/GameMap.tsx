import { Stage } from "react-pixi-fiber";
import { KyogenViewport } from "./PixiViewport";
import { TileMap } from "./TileMap";
import { useWorldDims } from "../hooks/useWorldDims";
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil";
import { SpawnLayer } from "./features/SpawnLayer";
import { TroopLayer } from "./units/TroopLayer";
import { AttackButtonLayer } from "./units/AttackButtonLayer";
import { MeteorLayer } from "./features/MeteorLayer";
import { HealerLayer } from "./features/HealerLayer";

export const GameMap = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  const BridgedRecoilRoot = useRecoilBridgeAcrossReactRoots_UNSTABLE();
  const { height: worldHeight, width: worldWidth } = useWorldDims();
  const stageHeight = Math.min(height, worldHeight);
  const stageWidth = Math.min(width, worldWidth);

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
          <MeteorLayer />
          <HealerLayer />
          <TroopLayer />
          <AttackButtonLayer />
        </KyogenViewport>
      </BridgedRecoilRoot>
    </Stage>
  );
};
