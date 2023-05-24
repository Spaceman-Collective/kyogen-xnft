import { useMemo } from "react";
import { Structures } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { gameWallet } from "../recoil";

export const useKyogenStructuresSdk = () => {
  const payer = useRecoilValue(gameWallet)?.publicKey;

  return useMemo(() => {
    return new Structures(
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      process.env.NEXT_PUBLIC_STRUCTURES_ID as string,
      payer?.toString() ?? ""
    );
  }, [payer]);
};
