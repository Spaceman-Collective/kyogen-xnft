import { useMemo } from "react";
import { Kyogen } from "kyogen-sdk";
import { useRecoilValue } from "recoil";
import { gameWallet } from "../recoil";

export const useKyogenInstructionSdk = () => {
  const payer = useRecoilValue(gameWallet)?.publicKey;

  return useMemo(() => {
    console.log(
      "new Kyogen: using the following values",
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      payer?.toString() ?? ""
    );
    return new Kyogen(
      process.env.NEXT_PUBLIC_COREDS_ID as string,
      process.env.NEXT_PUBLIC_REGISTRY_ID as string,
      process.env.NEXT_PUBLIC_KYOGEN_ID as string,
      payer?.toString() ?? ""
    );
  }, [payer]);
};
