import Image from "next/image";
import { useRecoilValue } from "recoil";
import AncientSamurai from "../../../public/ancient_samurai.webp";
import CreeperSamurai from "../../../public/creeper_samurai.webp";
import SynthSamurai from "../../../public/synth_samurai.webp";
import WildingSamurai from "../../../public/wildling_samurai.webp";
import Solarite from "../../../public/ui/solarite.webp";
// import Skull from "../../../public/ui/skull.webp";
import RefreshIcon from "../../../public/refresh.svg";
import {
  selectCurrentPlayer,
  selectSelectedMeteorAndPlayerUnit,
} from "../../recoil/selectors";
import { Clans } from "../../types";
import { playPhaseAtom } from "@/recoil";
import { GameEndScreen } from "./GameEndScreen";
import { GamePausedScreen } from "./GamePausedScreen";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { useCallback, useState } from "react";
import { useLoadGameStateFunc } from "../../hooks/useLoadGameState";
import { useClaimVictory } from "../../hooks/useClaimVictory";
import { useMeteor } from "../../hooks/useMeteor";

const clanToAvatarMap = {
  [Clans.Ancients]: AncientSamurai,
  [Clans.Creepers]: CreeperSamurai,
  [Clans.Synths]: SynthSamurai,
  [Clans.Wildings]: WildingSamurai,
};

export const GameOverlay = () => {
  const currentPlayer = useRecoilValue(selectCurrentPlayer);
  const playPhase = useRecoilValue(playPhaseAtom);
  const loadGameState = useLoadGameStateFunc();
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const _claimVictory = useClaimVictory();
  const mineMeteor = useMeteor();
  const claimVictory = useCallback(async () => {
    setClaiming(true);
    await _claimVictory();
    setClaiming(false);
  }, [_claimVictory]);
  const maybeMeteorTroop = useRecoilValue(selectSelectedMeteorAndPlayerUnit);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadGameState();
    setLoading(false);
  }, [loadGameState]);

  switch (playPhase) {
    case "Finished":
      return <GameEndScreen />;
    case "Lobby":
    case "Paused":
      return <GamePausedScreen />;
    default:
      return (
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 right-0 flex flex-row justify-between">
          <div>
            {currentPlayer && (
              <div className="inline-block mt-8 ml-2">
                <div className="flex flex-row items-center">
                  <Image
                    className="rounded-full border-solid border-4 border-[#15172E]"
                    height={60}
                    width={60}
                    src={clanToAvatarMap[currentPlayer.clan]}
                    alt="avatar"
                  />
                  <StatusTextContainer className="ml-[-4px]">
                    {currentPlayer.name}
                  </StatusTextContainer>
                </div>
                {/* <div className="relative flex flex-row items-center mt-8">
            <div className="bg-[#15172E] absolute top-[-10px] bottom-0 w-[60px] rounded-tl-lg rounded-bl-lg rounded-tr-3xl" />
            <Image
              className="absolute ml-1"
              height={50}
              width={50}
              src={Skull}
              alt="score"
            />
            <StatusTextContainer className="rounded-bl-lg ml-4">
              {currentPlayer.score}
            </StatusTextContainer>
           </div> */}
                <div className="relative flex flex-row items-center mt-8">
                  <div className="bg-[#15172E] absolute top-[-10px] bottom-0 w-[60px] rounded-tl-lg rounded-bl-lg rounded-tr-3xl" />
                  <Image
                    className="absolute ml-1"
                    height={50}
                    width={50}
                    src={Solarite}
                    alt="solarite"
                  />
                  <StatusTextContainer className="rounded-bl-lg ml-4">
                    {currentPlayer.score}
                  </StatusTextContainer>
                </div>
              </div>
            )}
          </div>
          <div className="mt-10 p-4">
            {!!maybeMeteorTroop && (
              <PrimaryButton
                className="pointer-events-auto mb-4"
                onClick={async () => {
                  const [meteor, troop, tileId] = maybeMeteorTroop;
                  try {
                    await mineMeteor(meteor.id, tileId, troop.id);
                  } catch (e) {
                    // swallow error
                  }
                }}
              >
                Mine Meteor
              </PrimaryButton>
            )}
            <PrimaryButton
              className="pointer-events-auto mb-4"
              onClick={claimVictory}
              loading={claiming}
            >
              Claim Victory
            </PrimaryButton>
            <PrimaryButton
              className="pointer-events-auto bg-[#384269] h-[30px] ml-auto"
              onClick={refresh}
            >
              <Image
                className={loading ? "animate-spin" : ""}
                src={RefreshIcon}
                height={20}
                width={20}
                alt="Refresh"
              />
            </PrimaryButton>
          </div>
        </div>
      );
  }
};

const StatusTextContainer = ({
  className,
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`bg-[#15172E] w-full rounded-br-[24px] rounded-tr-sm text-lg text-white text-right pl-[26px] pr-[15px] ${
        className ?? ""
      }`}
    >
      <p>{children}</p>
    </div>
  );
};
