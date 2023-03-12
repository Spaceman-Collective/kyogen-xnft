import * as PIXI from "pixi.js";
import { useEffect, useRef, useState } from "react";
import { Container, Sprite } from "react-pixi-fiber";
import { UNIT_LENGTH } from "../../constants";
import {
  AncientNinjaTexture,
  AncientSamuraiTexture,
  AncientSoheiTexture,
  CreeperNinjaTexture,
  CreeperSamuraiTexture,
  CreeperSoheiTexture,
  SynthNinjaTexture,
  SynthSamuraiTexture,
  SynthSoheiTexture,
  WildingNinjaTexture,
  WildingSamuraiTexture,
  WildingSoheiTexture,
} from "../../textures";
import { UnitNames } from "../../types";
import { RoundedRect } from "../PixiComponents";

const nameToTextureMap = {
  [UnitNames.AncientNinja]: AncientNinjaTexture,
  [UnitNames.AncientSohei]: AncientSoheiTexture,
  [UnitNames.AncientSamurai]: AncientSamuraiTexture,
  [UnitNames.CreeperNinja]: CreeperNinjaTexture,
  [UnitNames.CreeperSohei]: CreeperSoheiTexture,
  [UnitNames.CreeperSamurai]: CreeperSamuraiTexture,
  [UnitNames.SynthNinja]: SynthNinjaTexture,
  [UnitNames.SynthSohei]: SynthSoheiTexture,
  [UnitNames.SynthSamurai]: SynthSamuraiTexture,
  [UnitNames.WildingNinja]: WildingNinjaTexture,
  [UnitNames.WildingSohei]: WildingSoheiTexture,
  [UnitNames.WildingSamurai]: WildingSamuraiTexture,
};

export const ClippedUnit = ({
  name,
  ...props
}: Container & { name: UnitNames }) => {
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
        texture={nameToTextureMap[name]}
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
