import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { Container, Sprite } from "react-pixi-fiber";
import CreeperSohei from "../../../public/creeper_sohei.webp";
import { UNIT_LENGTH } from "../../constants";
import { RoundedRect } from "../PixiComponents";

const CreeperSoheiTexture = PIXI.Texture.from(CreeperSohei.src);

export const ClippedUnit = ({ ...props }: Container) => {
  const [, forceUpdate] = useState(0);
  const maskRef = useRef(null);
  useEffect(() => {
    // we must force an update on mount to ensure the Sprite receives the RoundedRect maskRef.
    // This adds an additional render :/ but is the easiest way to have the mask move with
    // the container/sprite.
    forceUpdate((x) => x + 1);
  }, []);

  return (
    <Container {...props}>
      <Sprite
        texture={CreeperSoheiTexture}
        height={UNIT_LENGTH}
        width={UNIT_LENGTH}
        mask={maskRef.current}
      />
      <RoundedRect
        ref={maskRef}
        fill={0xffffff}
        height={UNIT_LENGTH}
        width={UNIT_LENGTH}
        topLeftRadius={12}
        topRightRadius={12}
        bottomLeftRadius={36}
        bottomRightRadius={36}
      />
    </Container>
  );
};
