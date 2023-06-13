import { useMemo } from "react";
import { Structures } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { gameWallet } from "../recoil";
import { Keypair } from "@solana/web3.js";

export const useKyogenStructuresSdk = (admin?: Keypair | null) => {
  const payer = useRecoilValue(gameWallet)?.publicKey;

  return useMemo(() => {
    return new Structures(
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      process.env.NEXT_PUBLIC_STRUCTURES_ID as string,
      (admin) ? admin.publicKey.toString() : payer?.toString() ?? ""
    );
  }, [payer]);
};
