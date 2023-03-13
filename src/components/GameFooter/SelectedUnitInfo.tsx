import { useRecoilValue } from "recoil";

import InfoSquare from "./InfoSquare";
import DamageIcon from "../../../public/icons/sword.png";
import MoveIcon from "../../../public/icons/move.png";
import RangeIcon from "../../../public/icons/range.png";
import CoolDownIcon from "../../../public/icons/cooldown.png";
import { ImageProps } from "next/image";
import { selectTroopFromSelectedTile } from "@/recoil/selectors";
import { usePreviousDefined } from "@/hooks/usePreviousDefined";

const InfoContainer = ({
  icon,
  children,
}: {
  icon: ImageProps;
  children: React.ReactNode;
}) => (
  <div className="flex flex-row items-center mb-[16px]">
    <InfoSquare backgroundImage={icon} />
    <div className="ml-[12px]">{children}</div>
  </div>
);

const SelectedUnitInfo = () => {
  const tileTroop = useRecoilValue(selectTroopFromSelectedTile);
  const selectedTroop = usePreviousDefined(tileTroop);
  if (!selectedTroop) return null;

  return (
    <div className="pt-[35px] pl-[32px]">
      <p className="font-normal text-[30px] leading-[30px]">
        {selectedTroop.name}
      </p>
      <div className="flex flex-row mr-[20px] mt-[23px]">
        <div className="flex flex-col mr-[12px]">
          <InfoContainer icon={{ src: DamageIcon, alt: "Damage Icon" }}>
            <p>Damage</p>
            <p>
              {selectedTroop.min_damage} - {selectedTroop.max_damage}
            </p>
          </InfoContainer>
          <InfoContainer icon={{ src: MoveIcon, alt: "Move Icon" }}>
            <p>Move</p>
            <p>{selectedTroop.movement}</p>
          </InfoContainer>
        </div>
        <div className="flex flex-col">
          <InfoContainer icon={{ src: RangeIcon, alt: "Rang Icon" }}>
            <p>Attack Range</p>
            <p>{selectedTroop.attack_range}</p>
          </InfoContainer>
          <InfoContainer icon={{ src: CoolDownIcon, alt: "Cool Down Icon" }}>
            <p>Cool down</p>
            <p>{selectedTroop.recovery}s</p>
          </InfoContainer>
        </div>
      </div>
    </div>
  );
};

export default SelectedUnitInfo;
