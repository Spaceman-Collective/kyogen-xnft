import { Stage } from "react-pixi-fiber";
import { Viewport } from "./PixiViewport";
import Creeper from "../../public/Creeper-elements-states.png";
import { TileMap } from "./TileMap";
import { UnitSprite } from "./UnitSprite";
import { TILE_LENGTH, TILE_SPACING } from "../constants";

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
        <UnitSprite src={Creeper.src} movement={1} />
      </Viewport>
    </Stage>
  );
};
