import { useRecoilValue } from "recoil";
import { Clans, UnitNames } from "@/types";

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
import CreepersBorderImg from "../../../public/clans/creepers/frame_border.svg";
import CreepersBorderImgY from "../../../public/clans/creepers/frame_border_y.svg";
import CreepersFrameMedal from "../../../public/clans/creepers/frame_medal.svg";
import CreepersFrameKnot from "../../../public/clans/creepers/frame_knot.svg";

import AncientsBorderImg from "../../../public/clans/ancients/frame_border_x.svg";
import AncientsBorderImgY from "../../../public/clans/ancients/frame_border_y.svg";
import AncientsFrameMedal from "../../../public/clans/ancients/frame_medal.svg";
import AncientsFrameKnot from "../../../public/clans/ancients/frame_knot.svg";

import SynthsBorderImg from "../../../public/clans/synths/frame_border_x.svg";
import SynthsBorderImgY from "../../../public/clans/synths/frame_border_y.svg";
import SynthsFrameMedal from "../../../public/clans/synths/frame_medal.svg";
import SynthsFrameKnot from "../../../public/clans/synths/frame_knot.svg";

import WildlingsBorderImg from "../../../public/clans/wildlings/frame_border_x.svg";
import WildlingsBorderImgY from "../../../public/clans/wildlings/frame_border_y.svg";
import WildlingsFrameMedal from "../../../public/clans/wildlings/frame_medal.svg";
import WildlingsFrameKnot from "../../../public/clans/wildlings/frame_knot.svg";
import Image, { StaticImageData } from "next/image";
import { selectCurrentPlayer, selectTroopFromSelectedTile } from "@/recoil/selectors";
import SelectedUnitInfo from "./SelectedUnitInfo";

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
  // TODO: Change color based on percentage

  const healthPercentage =
    (parseFloat(currentHealth) / parseFloat(maxHealth)) * 100;
  return (
    <div className="relative bg-[#384269] w-full h-full p-[8px]">
      <div className="relative bg-kyogen-border h-[20px] rounded-[8px] rounded-tr-[0px] z-10">
        <div
          className={`absolute top-0 h-full rounded-[8px] bg-[#7DD75D] border-kyogen-border border-[1px] z-20`}
          style={{ width: `${healthPercentage}%` }}
        ></div>
        <p className="relative z-50 w-full text-center leading-[20px] text-[18px] font-extrabold font-outline-1 outline-none font-inter">
          {currentHealth} / {maxHealth}
        </p>
      </div>
    </div>
  );
};

const SelectedUnit = ({ className }: { className?: string }) => {
  const selectedTroop = useRecoilValue(selectTroopFromSelectedTile);
  if (!selectedTroop) return null;

  return (
    <div className={className}>
      <Image
        src={UnitNameToImageMap(selectedTroop.name)}
        alt={selectedTroop.name}
        height={236}
        width={236}
      />
      <HealthBar
        currentHealth={selectedTroop.health}
        maxHealth={selectedTroop.max_health}
      />
    </div>
  );
};

const VerticalBorder = ({ side = "left" }: { side?: "left" | "right" }) => {
  const player = useRecoilValue(selectCurrentPlayer);
  if (!player) return null;

  const clan = player.clan;

  let borderAssets = {
    frameBorder: AncientsBorderImgY,
    frameMedal: AncientsFrameMedal,
    frameKnot: AncientsFrameKnot,
  };

  if (clan === Clans.Creepers) {
    borderAssets = {
      frameBorder: CreepersBorderImgY,
      frameMedal: CreepersFrameMedal,
      frameKnot: CreepersFrameKnot,
    };
  } else if (clan === Clans.Synths) {
    borderAssets = {
      frameBorder: SynthsBorderImgY,
      frameMedal: SynthsFrameMedal,
      frameKnot: SynthsFrameKnot,
    };
  } else if (clan === Clans.Wildings) {
    borderAssets = {
      frameBorder: WildlingsBorderImgY,
      frameMedal: WildlingsFrameMedal,
      frameKnot: WildlingsFrameKnot,
    };
  }

  let borderSideAdjustment = "left-[-9px]";
  let medalSideAdjustment = "left-[-11px]";
  let knotSideAdjustment = "left-[-21.5px]";
  if (side === "right") {
    borderSideAdjustment = "right-[8px]";
    medalSideAdjustment = "right-[5px]";
    knotSideAdjustment = "right-[-5px]";
  }
  return (
    <>
      <div
        className={`absolute ${borderSideAdjustment} top-[5px] w-[28px] h-full z-50`}
        style={{ backgroundImage: `url('${borderAssets.frameBorder.src}')` }}
      ></div>
      <Image
        className={`absolute top-[-14px] z-50 ${medalSideAdjustment}`}
        src={borderAssets.frameMedal}
        alt="Frame Medal"
      />
      <Image
        className={`absolute top-0 z-50 ${knotSideAdjustment}`}
        src={borderAssets.frameKnot}
        alt="Frame Knot"
      />
    </>
  );
};

const HorizontalBorder = () => {
  const player = useRecoilValue(selectCurrentPlayer);
  if (!player) return null;

  const clan = player.clan;
  let frameBorder = AncientsBorderImg;
  if (clan === Clans.Creepers) {
    frameBorder = CreepersBorderImg;
  } else if (clan === Clans.Synths) {
    frameBorder = SynthsBorderImg;
  } else if (clan === Clans.Wildings) {
    frameBorder = WildlingsBorderImg;
  }
  return (
    <div
      className="absolute top-[-9px] w-full h-[18px] bg-repeat-x z-40"
      style={{ backgroundImage: `url('${frameBorder.src}')` }}
    ></div>
  );
};

const GameFooter = () => {
  return (
    <div className="relative flex flex-row grow max-h-[275px] font-millimetre bg-kyogen-fund-bg">
      <HorizontalBorder />
      <VerticalBorder />
      <div className="grow">Mini Map</div>
      <div className="relative min-w-[245px]">
        <VerticalBorder />
        <SelectedUnit className="relative pl-[9px] pt-[2px]" />
      </div>
      <div className="relative min-w-[245px]">
        <VerticalBorder />
        <SelectedUnitInfo />
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
