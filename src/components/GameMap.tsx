import { Stage } from "react-pixi-fiber";
import { Viewport } from "./PixiViewport";
import Creeper from "../../public/Creeper-elements-states.png";
import { TileMap } from "./TileMap";
import { UnitSprite } from "./UnitSprite";
import { TILE_LENGTH, TILE_SPACING } from "../constants";
import { useGameConfig } from "../context/GameConfigContext";

export const GameMap = () => {
  const { height, width } = useGameConfig();
  // TODO maybe need to `Math.min` by window dims?
  const stageHeight = height * TILE_LENGTH + TILE_SPACING * height;
  const stageWidth = width * TILE_LENGTH + TILE_SPACING * width;

  return (
    <Stage
      options={{
        backgroundColor: "#EAE6D5",
        height: stageHeight,
        width: stageWidth,
      }}
    >
      <Viewport screenHeight={stageHeight} screenWidth={stageWidth}>
        <TileMap />
        <UnitSprite initialX={0} initialY={0} src={Creeper.src} movement={1} />
      </Viewport>
    </Stage>
  );
};
