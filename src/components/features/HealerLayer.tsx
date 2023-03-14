import { Container, Sprite } from "react-pixi-fiber";
import { useRecoilValue } from "recoil";
import { FEATURE_LENGTH, FEATURE_OFFSET } from "../../constants";
import { healerIdsAtom, healersAtomFamily } from "../../recoil";
import { ShrineTexture } from "../../textures";
import { calculateUnitPositionOnTileCoords } from "../../utils/map";

export const HealerLayer = () => {
  const healerIds = useRecoilValue(healerIdsAtom);

  return (
    <>
      {healerIds.map((id) => (
        <Healer key={id} healerId={id} />
      ))}
    </>
  );
};

const Healer = ({ healerId }: { healerId: string }) => {
  const healer = useRecoilValue(healersAtomFamily(healerId));

  if (!healer) {
    return null;
  }

  const coords = calculateUnitPositionOnTileCoords(healer.x, healer.y);

  return (
    <Container x={coords.x} y={coords.y}>
      <Sprite
        height={FEATURE_LENGTH}
        width={FEATURE_LENGTH}
        texture={ShrineTexture}
        x={FEATURE_OFFSET}
        y={FEATURE_OFFSET}
      />
    </Container>
  );
};
