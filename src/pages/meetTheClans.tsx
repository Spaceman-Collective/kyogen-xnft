import Image, { StaticImageData } from "next/image";

import Page from "@/components/Page";
import Humans from "../../public/clans/login_human_2x.webp";
import HumansLogo from "../../public/clans/humans_logo_2x.webp";
import Wildlings from "../../public/clans/login_wildlings_2x.webp";
import WildlingsLogo from "../../public/clans/wildlings_logo_2x.webp";
import Creepers from "../../public/clans/login_creepers_2x.webp";
import CreepersLogo from "../../public/clans/creepers_logo_2x.webp";
import Cyborgs from "../../public/clans/login_cyborgs_2x.webp";
import CyborgsLogo from "../../public/clans/synths_logo_2x.webp";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ContainerTitle } from "@/components/typography/ContainerTitle";
import { useCallback, useState } from "react";
import { Clans } from "@/types";
import { useInitPlayer } from "@/hooks/useInitPlayer";
import { useRouter } from "next/router";
import { SdkLoader } from "../components/KyogenSdkLoader";

const clanMap: Record<number, Clans> = {
  0: Clans.Ancients,
  1: Clans.Wildings,
  2: Clans.Creepers,
  3: Clans.Synths,
};

const selectedWitdth = (selected: boolean | undefined): string => {
  if (selected === undefined) {
    return "hover:w-[329px]";
  } else if (selected) {
    return "w-[329px]";
  } else {
    return "";
  }
};

const selectedOpacity = (selected: boolean | undefined): string => {
  if (selected === undefined) {
    return "opacity-60  hover:opacity-0";
  } else if (selected) {
    return "opacity-0";
  } else {
    return "opacity-60";
  }
};

const selectedBonus = (selected: boolean | undefined): string => {
  if (selected === undefined) {
    return "hidden hover:block";
  } else if (selected) {
    return "block";
  } else {
    return "hidden";
  }
};

const Clan = ({
  className,
  bonusSkill,
  imageSrc,
  logoSrc,
  title,
  selected,
  onClick,
}: {
  className: string;
  bonusSkill: string;
  title: string;
  imageSrc: string | StaticImageData;
  logoSrc: string | StaticImageData;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col grow items-center ${selectedWitdth(
        selected
      )} h-[505px] ${className}`}
      onClick={onClick}
    >
      <div
        className={`absolute top-0 left-0 w-full h-full z-10 bg-kyogen-border ${selectedOpacity(
          selected
        )}`}
      ></div>
      <div className="mt-6 z-50">
        <Image
          height={87}
          width={87}
          src={logoSrc}
          alt={`Kyogen ${title} Logo`}
          className=""
        />
      </div>
      <div className="mt-3 z-50">
        <ContainerTitle>{title}</ContainerTitle>
      </div>
      <div
        className={`${
          hovered && selected === undefined
            ? "block"
            : `${selectedBonus(selected)}`
        } absolute bottom-[20px] bg-white rounded-[30px] h-[40px] p-[10px] text-black text-center text-[20px] leading-[20px] font-bold z-50`}
      >
        Bonus: {bonusSkill}
      </div>
      <div className="absolute bottom-0 z-0">
        <Image src={imageSrc} alt={`Kyogen ${title}`} className="" />
      </div>
    </div>
  );
};

const MeetTheClansComponent = () => {
  const router = useRouter();
  const initPlayerAction = useInitPlayer();
  const [clan, setClan] = useState<Clans | undefined>();
  const [loading, setLoading] = useState(false);

  const handleRandomizeClan = useCallback(() => {
    const clanInt = Math.floor(Math.random() * 4);
    setClan(clanMap[clanInt]);
  }, [setClan]);

  const handleInitPlayer = useCallback(async () => {
    if (!clan) return;
    setLoading(true);
    const txId = await initPlayerAction(clan);
    setLoading(false);
    // Drop the user into the game
    router.push("/games");
  }, [clan, initPlayerAction, router]);

  return (
    <Page title="MEET THE CLANS">
      <div className="flex flex-col mt-24 items-center">
        <div className="flex flex-row w-[1000px]">
          <Clan
            className="bg-[url('../../public/clans/login_bg_human_2x.webp')]"
            bonusSkill="Movement"
            imageSrc={Humans}
            logoSrc={HumansLogo}
            title="Ancients"
            selected={clan ? clan === Clans.Ancients : undefined}
            onClick={() => setClan(Clans.Ancients)}
          />
          <Clan
            className="bg-[url('../../public/clans/login_bg_wildlings_2x.webp')]"
            bonusSkill="Damage"
            imageSrc={Wildlings}
            logoSrc={WildlingsLogo}
            title="Wildlings"
            selected={clan ? clan === Clans.Wildings : undefined}
            onClick={() => setClan(Clans.Wildings)}
          />
          <Clan
            className="bg-[url('../../public/clans/login_bg_creepers_2x.webp')]"
            bonusSkill="Recovery"
            imageSrc={Creepers}
            logoSrc={CreepersLogo}
            title="Creepers"
            selected={clan ? clan === Clans.Creepers : undefined}
            onClick={() => setClan(Clans.Creepers)}
          />
          <Clan
            className="bg-[url('../../public/clans/login_bg_cyborgs_2x.webp')]"
            bonusSkill="HP"
            imageSrc={Cyborgs}
            logoSrc={CyborgsLogo}
            title="Cyborgs"
            selected={clan ? clan === Clans.Synths : undefined}
            onClick={() => setClan(Clans.Synths)}
          />
        </div>
        {clan ? (
          <PrimaryButton
            className="mt-24"
            loading={loading}
            onClick={handleInitPlayer}
          >
            Initialize Player
          </PrimaryButton>
        ) : (
          <PrimaryButton className="mt-24" onClick={handleRandomizeClan}>
            Randomize Clan
          </PrimaryButton>
        )}
      </div>
    </Page>
  );
};

// NOTE: Without the SdkLoader here, we run into the following error at build time.
//
// `TypeError: Cannot read properties of undefined (reading '__wbindgen_malloc')`
const MeetTheClans = () => {
  return (
    <SdkLoader>
      <MeetTheClansComponent />
    </SdkLoader>
  );
};

export default MeetTheClans;
