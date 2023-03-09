import Image, { StaticImageData } from "next/image";

import Page from "@/components/Page";
import Humans from "../../public/clans/humans.svg";
import Wildlings from "../../public/clans/wildlings.svg";
import Creepers from "../../public/clans/creepers.svg";
import Cyborgs from "../../public/clans/cyborgs.svg";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";

const Clan = ({
  bgColor,
  imageSrc,
  title,
}: {
  bgColor: string;
  title: string;
  imageSrc: string | StaticImageData;
}) => {
  return (
    <div className={`w-[250px] h-[505px] bg-[#${bgColor}]`}>
      <Image src={imageSrc} alt={`Kyogen ${title}`} className="" />
    </div>
  );
};

const MeetTheClans = () => {
  return (
    <Page title="MEET THE CLANS">
      <div className="flex flex-col mt-24 items-center">
        <div className="flex flex-row">
          <Clan bgColor="54aeb9" imageSrc={Humans} title="ANCIENTS" />
          <Clan bgColor="ff971d" imageSrc={Wildlings} title="Wildlings" />
          <Clan bgColor="e63b47" imageSrc={Creepers} title="Creepers" />
          <Clan bgColor="62c322" imageSrc={Cyborgs} title="Cyborgs" />
        </div>
        <PrimaryButton className="mt-24">Randomize Clan</PrimaryButton>
      </div>
    </Page>
  );
};

export default MeetTheClans;
