import { Sprite, Stage } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { Viewport } from "./PixiViewport";
import Creeper from "../../public/Creeper-elements-states.png";
import { TileMap, TILE_LENGTH, TILE_SPACING } from "./TileMap";

export const GameMap = () => {
  // TODO use dynamic map dims
  const mapWidth = 8;
  const mapHeight = 8;
  // TODO maybe need to `Math.min` by window dims?
  const stageHeight = mapHeight * TILE_LENGTH + TILE_SPACING * mapHeight;
  const stageWidth = mapWidth * TILE_LENGTH + TILE_SPACING * mapWidth;

  return (
    <Stage
      options={{
        backgroundColor: "#000000",
        height: stageHeight,
        width: stageWidth,
      }}
    >
      <Viewport screenHeight={stageHeight} screenWidth={stageWidth}>
        <TileMap height={mapHeight} width={mapWidth} />
        <Sprite
          // TODO Creeper sprite should drag over the map, not with it
          texture={PIXI.Texture.from(Creeper.src)}
          x={4}
          y={-4}
        />
      </Viewport>
    </Stage>
  );
};
