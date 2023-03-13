import { useRecoilValue } from "recoil";
import { selectedUnitAtom } from "@/recoil";
import { UnitNames } from "@/types";

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
import CreepersBorderImg from "../../../public/clans/creepers/game_border.svg";
import CreepersBorderImgY from "../../../public/clans/creepers/game_border_y.svg";
import Image, { StaticImageData } from "next/image";

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
  return (
    <div className="relative bg-[#384269] w-full h-full p-[8px]">
      <div className="relative bg-kyogen-border h-[20px] rounded-[8px] rounded-tr-[0px] z-10">
        <div
          className={`absolute top-0 h-full rounded-[8px] bg-[#7DD75D] border-kyogen-border border-[1px] z-20`}
          style={{ width: `${healthPercentage}%` }}
        ></div>
        <p className="relative z-50 w-full text-center leading-[20px] text-[18px] font-extrabold font-outline-2 outline-none">
          {currentHealth} / {maxHealth}
        </p>
      </div>
    </div>
  );
};

const SelectedUnit = ({ className }: { className?: string }) => {
  const selectedUnit = useRecoilValue(selectedUnitAtom);
  if (!selectedUnit) return null;

  return (
    <div className={className}>
      <Image
        src={UnitNameToImageMap(selectedUnit.name)}
        alt={selectedUnit.name}
        height={236}
        width={236}
      />
      <HealthBar
        currentHealth={selectedUnit.health}
        maxHealth={selectedUnit.max_health}
      />
    </div>
  );
};

const VerticalBorder = ({ side = "left" }: { side?: "left" | "right" }) => (
  <div
    className={`absolute ${side === "left" ? "left-[-9px]" : ""} ${
      side === "right" ? "right-[8px]" : ""
    } top-[5px] w-[28px] h-full z-40`}
    style={{ backgroundImage: `url('${CreepersBorderImgY.src}')` }}
  ></div>
);

const GameFooter = () => {
  // TODO: Use clan to change border

  return (
    <div className="relative flex flex-row grow max-h-[275px]">
      <div
        className="absolute top-[-9px] w-full h-[18px] bg-repeat-x z-50"
        style={{ backgroundImage: `url('${CreepersBorderImg.src}')` }}
      ></div>
      <VerticalBorder />
      <div className="grow">Mini Map</div>
      <div className="relative">
        <VerticalBorder />
        <SelectedUnit className="relative pl-[9px] pt-[2px]" />
      </div>
      <div className="grow relative">
        <VerticalBorder />
        Unit Info
      </div>
      <div className="grow relative">
        <VerticalBorder />
        Game feed
        <VerticalBorder side="right" />
      </div>
    </div>
  );
};

export default GameFooter;
