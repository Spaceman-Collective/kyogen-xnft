import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Image from "next/image";

import { InputContainer } from "@/components/inputs/InputContainer";
import { ContainerTitle } from "@/components/typography/ContainerTitle";
import KyogenLogo from "../../public/kyogen-logo.svg";
import SolanaLogoLight from "../../public/solana_logo_light.svg";
import SolanaLogo from "../../public/solana_logo.svg";
import { TextInput } from "@/components/inputs/TextInput";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import {
  gameWallet as gameWalletAtom,
  gameWalletBalance as gameWalletBalanceAtom,
} from "../recoil/atoms";
import { useFetchGameWalletBalance } from "@/hooks/useFetchGameWalletBalance";
import Page from "@/components/Page";
import { useRouter } from "next/router";

const inputContainerClass = "w-[409px] items-center";

const MIN_SOL_TRANSFER = 0.1;

const FundWallet = () => {
  const router = useRouter();
  const gameWallet = useRecoilValue(gameWalletAtom);
  const gameWalletBalance = useRecoilValue(gameWalletBalanceAtom);
  const fetchGameWalletBalance = useFetchGameWalletBalance();
  const [transferAmount, setTransferAmount] = useState(0);
  const [canProceed, setCanProceed] = useState(false);

  useEffect(() => {
    fetchGameWalletBalance();
  }, []);

  useEffect(() => {
    setCanProceed(gameWalletBalance > 0.25);
  }, [gameWalletBalance]);

  const handleTransfer = useCallback(async () => {
    // Check that the transfer value is greater than 0
    if (transferAmount < MIN_SOL_TRANSFER) {
      // TODO: Alert's don't work in xNFT environment. Use another feedback provider
      console.error(`Must transfer at least ${MIN_SOL_TRANSFER}`);
      return;
    }
    if (!gameWallet) {
      console.error("gameKeypair not found");
      return;
    }

    // Create the transfer transaction
    const transaction = new Transaction();
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: window.xnft.solana.publicKey,
      toPubkey: gameWallet.publicKey,
      lamports: LAMPORTS_PER_SOL * transferAmount,
    });
    transaction.add(transferInstruction);

    // TODO: Wrap transaction sending and confirming in DRY error handling
    const txId = await window.xnft.solana.sendAndConfirm(transaction, [], {
      commitment: "confirmed",
    });
    console.log(`Transaction ${txId} confirmed`);
    await fetchGameWalletBalance();
  }, [transferAmount, gameWallet]);

  return (
    <Page title="FUND YOUR GAME WALLET">
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
          <PrimaryButton
            className="text-xl px-7 mt-10 mb-2"
            onClick={handleTransfer}
          >
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
          <p className="text-black text-xl">{gameWalletBalance}</p>
          <PrimaryButton
            className="text-xl px-7 mt-10 mb-2"
            disabled={!canProceed}
            onClick={() => {router.push('/meetTheClans')}}
          >
            NEXT
          </PrimaryButton>
        </InputContainer>
      </div>
    </Page>
  );
};

export default FundWallet;
