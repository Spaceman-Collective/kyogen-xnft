import { Stage } from "react-pixi-fiber";
import { KyogenViewport } from "./PixiViewport";
import Creeper from "../../public/Creeper-elements-states.png";
import { TileMap } from "./TileMap";
import { UnitSprite } from "./UnitSprite";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import { useGameConfig } from "../context/GameConfigContext";
import { useWindowSize } from "usehooks-ts";

export const GameMap = () => {
  const { height, width } = useGameConfig();
  const windowSize = useWindowSize();
  const mapHeight = height * TILE_LENGTH + TILE_SPACING * height;
  const mapWidth = width * TILE_LENGTH + TILE_SPACING * width;
  const stageHeight = Math.min(windowSize.height, mapHeight);
  const stageWidth = Math.min(windowSize.width, mapWidth);

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
        worldHeight={mapHeight}
        worldWidth={mapWidth}
      >
        <TileMap />
        <UnitSprite initialX={0} initialY={0} src={Creeper.src} movement={1} />
      </KyogenViewport>
    </Stage>
  );
};
