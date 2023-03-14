import { usePreviousDefined } from "@/hooks/usePreviousDefined";
import { selectTroopFromSelectedTile } from "@/recoil/selectors";
import { useRecoilValue } from "recoil";
import Image, { StaticImageData } from "next/image";
import { Troop, UnitNames } from "@/types";

import AncientNinja from "../../../public/ancient_ninja.webp";
import CreeperNinja from "../../../public/creeper_ninja.webp";
import SynthNinja from "../../../public/synth_ninja.webp";
import WildingNinja from "../../../public/wildling_ninja.webp";
import AncientSohei from "../../../public/ancient_sohei.webp";
import CreeperSohei from "../../../public/creeper_sohei.webp";
import SynthSohei from "../../../public/synth_sohei.webp";
import WildingSohei from "../../../public/wildling_sohei.webp";
import AncientSamurai from "../../../public/ancient_samurai.webp";
import CreeperSamurai from "../../../public/creeper_samurai.webp";
import SynthSamurai from "../../../public/synth_samurai.webp";
import WildingSamurai from "../../../public/wildling_samurai.webp";
import { currentSlotAtom } from "@/recoil";

const UnitNameToImageMap = (name: UnitNames): StaticImageData => {
  switch (name) {
    case UnitNames.AncientNinja:
      return AncientNinja;
    case UnitNames.AncientSamurai:
      return AncientSamurai;
    case UnitNames.AncientSohei:
      return AncientSohei;
    case UnitNames.CreeperNinja:
      return CreeperNinja;
    case UnitNames.CreeperSamurai:
      return CreeperSamurai;
    case UnitNames.CreeperSohei:
      return CreeperSohei;
    case UnitNames.WildingNinja:
      return WildingNinja;
    case UnitNames.WildingSamurai:
      return WildingSamurai;
    case UnitNames.WildingSohei:
      return WildingSohei;
    case UnitNames.SynthNinja:
      return SynthNinja;
    case UnitNames.SynthSamurai:
      return SynthSamurai;
    case UnitNames.SynthSohei:
      return SynthSohei;
    default:
      throw new Error(`Unknown UnitName ${name}`);
  }
};

const HealthBar = ({
  currentHealth,
  maxHealth,
}: {
  currentHealth: string;
  maxHealth: string;
}) => {
  const healthPercentage =
    (parseFloat(currentHealth) / parseFloat(maxHealth)) * 100;

  let barColor = "bg-[#7DD75D]";
  if (healthPercentage < 60) barColor = "bg-[#FFC32D]";
  if (healthPercentage <= 33.4) barColor = "bg-[#FF3D46]";
  return (
    <div className="relative bg-[#384269] w-full h-full p-[8px]">
      <div className="relative bg-kyogen-border h-[20px] rounded-[8px] rounded-tr-[0px] z-10">
        <div
          className={`absolute top-0 h-full rounded-[8px] ${barColor} border-kyogen-border border-[1px] z-20`}
          style={{ width: `${healthPercentage}%` }}
        ></div>
        <p className="relative z-50 w-full text-center leading-[20px] text-[18px] font-extrabold outline-none font-inter">
          {currentHealth} / {maxHealth}
        </p>
      </div>
    </div>
  );
};

const UnitImage = ({ troop }: { troop: Troop }) => {
  const currentSlot = useRecoilValue(currentSlotAtom);

  let coolDownPercentage =
    ((currentSlot - parseInt(troop.last_used)) / parseInt(troop.recovery)) *
    100;
  coolDownPercentage = coolDownPercentage > 100 ? 100 : coolDownPercentage;

  return (
    <div className="relative">
      <div
        className="absolute top-0 h-full bg-black/75"
        style={{ width: `${100 - coolDownPercentage}%` }}
      ></div>
      <Image
        src={UnitNameToImageMap(troop.name)}
        alt={troop.name}
        height={236}
        width={236}
      />
    </div>
  );
};
const SelectedUnit = ({ className }: { className?: string }) => {
  const selectedTroop = useRecoilValue(selectTroopFromSelectedTile);
  const prevSelectedTroop = usePreviousDefined(selectedTroop);
  const troop = selectedTroop || prevSelectedTroop;
  if (!troop) return null;

  return (
    <div className={className}>
      <UnitImage troop={troop} />
      <HealthBar currentHealth={troop.health} maxHealth={troop.max_health} />
    </div>
  );
};

export default SelectedUnit;
