import { Stage } from "react-pixi-fiber";
import { KyogenViewport } from "./PixiViewport";
import Creeper from "../../public/creeper_tmp_2x.webp";
import { TileMap } from "./TileMap";
import { UnitSprite } from "./UnitSprite";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import { useWindowSize } from "usehooks-ts";
import { SpawnSprite } from "./features/Spawn";
import { useWorldDims } from "../hooks/useWorldDims";

export const GameMap = () => {
  const { height: worldHeight, width: worldWidth } = useWorldDims();
  const windowSize = useWindowSize();
  const stageHeight = Math.min(windowSize.height, worldHeight);
  const stageWidth = Math.min(windowSize.width, worldWidth);

  return (
    <Stage
      options={{
        antialias: true,
        backgroundColor: 0xeae6d5,
        height: stageHeight,
        width: stageWidth,
      }}
    >
      <KyogenViewport
        screenHeight={stageHeight}
        screenWidth={stageWidth}
        worldHeight={worldHeight}
        worldWidth={worldWidth}
      >
        <TileMap />
        <UnitSprite initialX={0} initialY={0} src={Creeper.src} movement={1} />
        <SpawnSprite
          x={TILE_LENGTH + TILE_SPACING}
          y={TILE_LENGTH + TILE_SPACING}
        />
        <SpawnSprite
          x={(TILE_LENGTH + TILE_SPACING) * 3}
          y={(TILE_LENGTH + TILE_SPACING) * 3}
        />
      </KyogenViewport>
    </Stage>
  );
};
