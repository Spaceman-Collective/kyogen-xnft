import { useMemo } from "react";
import { Registry } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { gameWallet } from "../recoil";
import { Keypair } from "@solana/web3.js";

export const useKyogenRegistrySdk = (admin?: Keypair | null) => {
  const payer = useRecoilValue(gameWallet)?.publicKey;

  return useMemo(() => {
    return new Registry(
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      (admin) ? admin.publicKey.toString() : payer?.toString() ?? ""
    );
  }, [payer, admin]);
};
