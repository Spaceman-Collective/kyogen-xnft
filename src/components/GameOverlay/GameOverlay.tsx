import Image from "next/image";
import { useRecoilValue } from "recoil";
import AncientSamurai from "../../../public/ancient_samurai.webp";
import CreeperSamurai from "../../../public/creeper_samurai.webp";
import SynthSamurai from "../../../public/synth_samurai.webp";
import WildingSamurai from "../../../public/wildling_samurai.webp";
import Solarite from "../../../public/ui/solarite.webp";
import Skull from "../../../public/ui/skull.webp";
import { selectCurrentPlayer } from "../../recoil/selectors";
import { Clans } from "../../types";

const clanToAvatarMap = {
  [Clans.Ancients]: AncientSamurai,
  [Clans.Creepers]: CreeperSamurai,
  [Clans.Synths]: SynthSamurai,
  [Clans.Wildings]: WildingSamurai,
};

export const GameOverlay = () => {
  const currentPlayer = useRecoilValue(selectCurrentPlayer);

  return (
    <div className="pointer-events-none absolute top-0 bottom-0 left-0 right-0">
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
  );
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
