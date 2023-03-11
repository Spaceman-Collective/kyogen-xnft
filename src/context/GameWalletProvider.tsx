import React, { useEffect } from "react";
import { loadOrCreateGameWallet } from "@/utils/gameWallet";
import { gameWallet as gameWalletAtom } from "../recoil/atoms";
import { useSetRecoilState } from "recoil";

export const XnftGameWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const setGameWallet = useSetRecoilState(gameWalletAtom);

  useEffect(() => {
    (async () => {
      // TODO: [nice to have] on initiatl xNFT load this key is undefined. Could make setting the 
      //  game wallet more event driven.
      await new Promise((resolve, reject) => {
       const intervalId = setInterval(() => {
        if (!window.xnft.solana.publicKey) return;
        clearInterval(intervalId);
        resolve(true)
       }, 500) 
      })

    const keypair = loadOrCreateGameWallet(window.xnft.solana.publicKey);
    setGameWallet(keypair);
    })();
  }, [setGameWallet]);

  return <>{children}</>;
};
