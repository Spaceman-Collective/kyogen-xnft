import { useCallback, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Image from "next/image";
import { InputContainer } from "@/components/inputs/InputContainer";
import { ContainerTitle } from "@/components/typography/ContainerTitle";
import SolanaLogoLight from "../../public/solana_logo_light.svg";
import SolanaLogo from "../../public/solana_logo.svg";
import { TextInput } from "@/components/inputs/TextInput";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import {
  LAMPORTS_PER_SOL,
  sendAndConfirmRawTransaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  connectionAtom,
  gameWallet as gameWalletAtom,
  gameWalletBalance as gameWalletBalanceAtom,
  notificationsAtom,
} from "../recoil/atoms";
import { useFetchGameWalletBalance } from "@/hooks/useFetchGameWalletBalance";
import Page from "@/components/Page";
import { useRouter } from "next/router";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { web3 } from "@coral-xyz/anchor";
import { useAirdrop, useCanAirdrop } from "../hooks/useCanAirdrop";

const inputContainerClass = "w-[409px] items-center";

const MIN_SOL_TRANSFER = 0.1;

const FundWallet = () => {
  const router = useRouter();
  const gameWallet = useRecoilValue(gameWalletAtom);
  const gameWalletBalance = useRecoilValue(gameWalletBalanceAtom);
  const setNotifications = useSetRecoilState(notificationsAtom);
  const fetchGameWalletBalance = useFetchGameWalletBalance();
  const [transferAmount, setTransferAmount] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const connection = useRecoilValue(connectionAtom);
  const canAirdrop = useCanAirdrop();
  const airdrop = useAirdrop();

  useEffect(() => {
    fetchGameWalletBalance();
  }, [fetchGameWalletBalance]);

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
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: window.xnft.solana.publicKey,
      toPubkey: gameWallet.publicKey,
      lamports: LAMPORTS_PER_SOL * transferAmount,
    });
    const latestBlockInfo = await connection.getLatestBlockhash();
    const msg = new web3.TransactionMessage({
      payerKey: window.xnft.solana.publicKey,
      recentBlockhash: latestBlockInfo.blockhash,
      instructions: [transferInstruction],
    }).compileToLegacyMessage();
    const tx = new web3.VersionedTransaction(msg);

    const signedTx = await window.xnft.solana.signTransaction(tx);

    if (!signedTx.signatures[0]) throw new Error("No signature on TX");
    const txSig = bs58.encode(signedTx.signatures[0]);
    console.log(`txId: ${txSig}`);

    const confirmationStrategy = {
      signature: txSig,
      blockhash: latestBlockInfo.blockhash,
      lastValidBlockHeight: latestBlockInfo.lastValidBlockHeight + 50,
    };
    await sendAndConfirmRawTransaction(
      connection,
      Buffer.from(tx.serialize()),
      confirmationStrategy,
      { commitment: "confirmed", skipPreflight: true }
    );
    setNotifications((notifications) => [
      ...notifications,
      {
        role: "success",
        message: `Transaction ${txSig.substring(0, 8)}.. confirmed`,
      },
    ]);
    await fetchGameWalletBalance();
    setTimeout(() => {
      fetchGameWalletBalance();
    }, 5_000);
  }, [
    connection,
    gameWallet,
    fetchGameWalletBalance,
    setNotifications,
    transferAmount,
  ]);

  return (
    <Page title="FUND YOUR GAME WALLET TEST">
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
          <label>{gameWallet?.publicKey.toString()}</label>
          <Image
            src={SolanaLogoLight}
            alt="Solana Logo Light"
            className="mt-10"
          />
          <p className="mt-10 text-2xl text-black font-extrabold">SOL</p>
          <p className="text-black text-xl">{gameWalletBalance}</p>

          {canAirdrop && (
            <PrimaryButton
              className="text-xl px-7"
              loading={airdropping}
              onClick={async () => {
                if (!gameWallet) {
                  return;
                }
                setAirdropping(true);
                await airdrop(gameWallet.publicKey);
                setAirdropping(false);
                fetchGameWalletBalance();
              }}
            >
              Airdrop
            </PrimaryButton>
          )}
          <PrimaryButton
            className="text-xl px-7 mt-10 mb-2"
            disabled={!canProceed}
            onClick={() => {
              router.push("/meetTheClans");
            }}
          >
            NEXT
          </PrimaryButton>
        </InputContainer>
      </div>
    </Page>
  );
};

export default FundWallet;
