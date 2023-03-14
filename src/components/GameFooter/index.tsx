import { useRecoilValue } from "recoil";
import { Clans } from "@/types";

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
import Image from "next/image";
import { selectCurrentPlayer } from "@/recoil/selectors";
import SelectedUnitInfo from "./SelectedUnitInfo";
import SelectedUnit from "./SelectedUnit";
import { GameFeed } from "./GameFeed";

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
    <div className="relative flex flex-row grow max-h-[275px] font-millimetre bg-kyogen-fund-bg min-h-[275px]">
      <HorizontalBorder />
      <div className="relative min-w-[245px]">
        <SelectedUnit className="relative pl-[9px] pt-[2px]" />
      </div>
      <div className="relative min-w-[245px]">
        <VerticalBorder />
        <SelectedUnitInfo />
      </div>

      <div className="grow relative">
        <VerticalBorder />
        <GameFeed />
      </div>

    </div>
  );
};

export default GameFooter;
