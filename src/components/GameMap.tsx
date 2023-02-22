import { Sprite, Stage } from "react-pixi-fiber";
import * as PIXI from "pixi.js";
import { Viewport } from "./PixiViewport";
import Creeper from "../../public/Creeper-elements-states.png";

export const GameMap = () => {
  return (
    <Stage options={{ backgroundColor: '#EAE6D5', height: 600, width: 800 }}>
      <Viewport screenHeight={600} screenWidth={800}>
        <Sprite
          texture={PIXI.Texture.from(Creeper.src)}
          x={20}
          y={20}
          anchor={0.5}
        />
      </Viewport>
    </Stage>
  );
};
