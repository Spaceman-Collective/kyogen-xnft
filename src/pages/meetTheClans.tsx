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

const Clan = ({
  className,
  imageSrc,
  logoSrc,
  title,
}: {
  className: string;
  title: string;
  imageSrc: string | StaticImageData;
  logoSrc: string | StaticImageData;
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`relative flex flex-col items-center w-[250px] h-[505px] ${className}`}
    >
      {!isHover && (
        <div className="absolute top-0 left-0 w-[250px] h-[505px] z-10 bg-kyogen-border opacity-60"></div>
      )}
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
      <div className="absolute bottom-0 z-0">
        <Image src={imageSrc} alt={`Kyogen ${title}`} className="" />
      </div>
    </div>
  );
};

const MeetTheClans = () => {
  return (
    <Page title="MEET THE CLANS">
      <div className="flex flex-col mt-24 items-center">
        <div className="flex flex-row">
          <Clan
            className="bg-[url('../../public/clans/login_bg_human_2x.webp')]"
            imageSrc={Humans}
            logoSrc={HumansLogo}
            title="ANCIENTS"
          />
          <Clan
            className="bg-[url('../../public/clans/login_bg_wildlings_2x.webp')]"
            imageSrc={Wildlings}
            logoSrc={WildlingsLogo}
            title="Wildlings"
          />
          <Clan
            className="bg-[url('../../public/clans/login_bg_creepers_2x.webp')]"
            imageSrc={Creepers}
            logoSrc={CreepersLogo}
            title="Creepers"
          />
          <Clan
            className="bg-[url('../../public/clans/login_bg_cyborgs_2x.webp')]"
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
