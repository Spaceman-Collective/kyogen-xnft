import { Container, Sprite } from "react-pixi-fiber";
import { useRecoilValue } from "recoil";
import { FEATURE_LENGTH, FEATURE_OFFSET } from "../../constants";
import { meteorIdsAtom, meteorsAtomFamily } from "../../recoil";
import { MeteorTexture } from "../../textures";
import { calculateUnitPositionOnTileCoords } from "../../utils/map";

export const MeteorLayer = () => {
  const meteorIds = useRecoilValue(meteorIdsAtom);

  return (
    <>
      {meteorIds.map((id) => (
        <Meteor key={id} meteorId={id} />
      ))}
    </>
  );
};

const Meteor = ({ meteorId }: { meteorId: string }) => {
  const meteor = useRecoilValue(meteorsAtomFamily(meteorId));

  if (!meteor) {
    return null;
  }

  const coords = calculateUnitPositionOnTileCoords(meteor.x, meteor.y);

  return (
    <Container x={coords.x} y={coords.y}>
      <Sprite
        height={FEATURE_LENGTH}
        width={FEATURE_LENGTH}
        texture={MeteorTexture}
        x={FEATURE_OFFSET}
        y={FEATURE_OFFSET}
      />
    </Container>
  );
};
