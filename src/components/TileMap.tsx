import { Texture } from "pixi.js";
import { Container, Sprite } from "react-pixi-fiber";
import MapTile from "../../public/MapTile.png";
import { TILE_LENGTH, TILE_SPACING } from "../constants";

export const TileMap = ({
  height,
  width,
}: {
  height: number;
  width: number;
}) => {
  return (
    <Container>
      {Array.from({ length: width }).map((_, i) => {
        return Array.from({ length: height }).map((_, j) => {
          let x = i * TILE_LENGTH;
          let y = j * TILE_LENGTH;
          if (i !== 0) {
            x += (TILE_SPACING * i)
          }
          if (j !== 0) {
            y += (TILE_SPACING * j)
          }
          return (
            <Sprite
              key={`${i}-${j}`}
              texture={Texture.from(MapTile.src)}
              x={x}
              y={y}
            />
          );
        });
      })}
    </Container>
  );
};
