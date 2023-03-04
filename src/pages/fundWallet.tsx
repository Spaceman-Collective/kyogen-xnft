import { useState } from "react";
import Image from "next/image";

import { InputContainer } from "@/components/inputs/InputContainer";
import { ContainerTitle } from "@/components/typography/ContainerTitle";
import KyogenLogo from "../../public/kyogen-logo.svg";
import SolanaLogoLight from "../../public/solana_logo_light.svg";
import SolanaLogo from "../../public/solana_logo.svg";
import { TextInput } from "@/components/inputs/TextInput";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";

const inputContainerClass = "w-[409px] items-center";

const FundWallet = () => {
  const [transferAmount, setTransferAmount] = useState(0);
  // TODO: Access the connected wallet
  // 

  return (
    <div className="font-millimetre bg-kyogen-fund-bg min-h-screen min-w-screen">
      <Image
        src={KyogenLogo}
        alt="Kyogen Clash"
        className="mt-10 ml-10 absolute"
      />
      <div className="flex justify-center">
        <p className="text-center mt-36 font-extrabold text-[#FF3D46] text-4xl">
          FUND YOUR GAME WALLET
        </p>
      </div>

      <div className="flex flex-row mt-36 justify-around">
        {/* TODO: change to flex column and adjust width for smaller screens */}
        <InputContainer className={inputContainerClass}>
          <ContainerTitle>YOUR WALLET</ContainerTitle>
          <Image src={SolanaLogo} alt="Solana Logo Dark" className="mt-10" />
          <p className="mt-10 text-2xl text-black font-extrabold">SOL</p>
          <TextInput
            className="text-center"
            type="number"
            step={0.01}
            value={transferAmount}
            onChange={(e) => setTransferAmount(parseFloat(e.target.value))}
          />
          <PrimaryButton className="text-xl px-7 mt-10 mb-2">
            TRANSFER
          </PrimaryButton>
        </InputContainer>
        <InputContainer className={inputContainerClass}>
          <ContainerTitle>YOUR GAME WALLET</ContainerTitle>
          <Image
            src={SolanaLogoLight}
            alt="Solana Logo Light"
            className="mt-10"
          />
          <p className="mt-10 text-2xl text-black font-extrabold">SOL</p>
          <p className="text-black text-xl">0</p>
          <PrimaryButton className="text-xl px-7 mt-10 mb-2" disabled>
            NEXT
          </PrimaryButton>
        </InputContainer>
      </div>
    </div>
  );
};

export default FundWallet;
