import { useMemo } from "react";
import { Registry } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { gameWallet } from "../recoil";

export const useKyogenRegistrySdk = () => {
  const payer = useRecoilValue(gameWallet)?.publicKey;

  return useMemo(() => {
    return new Registry(
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      payer?.toString() ?? ""
    );
  }, [payer]);
};
