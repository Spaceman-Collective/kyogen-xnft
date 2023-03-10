import Image, { StaticImageData } from "next/image";

import Page from "@/components/Page";
import Humans from "../../public/clans/humans.svg";
import HumansLogo from "../../public/clans/humans_logo_2x.webp";
import Wildlings from "../../public/clans/wildlings.svg";
import WildlingsLogo from "../../public/clans/wildlings_logo_2x.webp";
import Creepers from "../../public/clans/creepers.svg";
import CreepersLogo from "../../public/clans/creepers_logo_2x.webp";
import Cyborgs from "../../public/clans/cyborgs.svg";
import CyborgsLogo from "../../public/clans/synths_logo_2x.webp";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ContainerTitle } from "@/components/typography/ContainerTitle";

const Clan = ({
  bgColor,
  imageSrc,
  logoSrc,
  title,
}: {
  bgColor: string;
  title: string;
  imageSrc: string | StaticImageData;
  logoSrc: string | StaticImageData;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-between w-[250px] h-[505px] bg-[#${bgColor}]`}
    >
      <div className="mt-6">
        <Image height={87} width={87} src={logoSrc} alt={`Kyogen ${title} Logo`} className="" />
      </div>
      <div className="mt-3">
        <ContainerTitle>{title}</ContainerTitle>
      </div>
      <Image src={imageSrc} alt={`Kyogen ${title}`} className="" />
    </div>
  );
};

const MeetTheClans = () => {
  return (
    <Page title="MEET THE CLANS">
      <div className="flex flex-col mt-24 items-center">
        <div className="flex flex-row">
          <Clan
            bgColor="54aeb9"
            imageSrc={Humans}
            logoSrc={HumansLogo}
            title="ANCIENTS"
          />
          <Clan
            bgColor="ff971d"
            imageSrc={Wildlings}
            logoSrc={WildlingsLogo}
            title="Wildlings"
          />
          <Clan
            bgColor="e63b47"
            imageSrc={Creepers}
            logoSrc={CreepersLogo}
            title="Creepers"
          />
          <Clan
            bgColor="62c322"
            imageSrc={Cyborgs}
            logoSrc={CyborgsLogo}
            title="Cyborgs"
          />
        </div>
        <PrimaryButton className="mt-24">Randomize Clan</PrimaryButton>
      </div>
    </Page>
  );
};

export default MeetTheClans;
