import React, { useEffect } from "react";
import { loadOrCreateGameWallet } from "@/utils/gameWallet";
import { gameWallet as gameWalletAtom } from "../recoil/atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Keypair } from "@solana/web3.js";

export const XnftGameWalletProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [gameWallet, setGameWallet] = useRecoilState(gameWalletAtom);

  useEffect(() => {
    (async () => {
      // TODO: [nice to have] on initiatl xNFT load this key is undefined. Could make setting the
      //  game wallet more event driven.
      //
      //  TODO: Leave this Promise as is once we're done implementing `Start New Game`
      //
      await new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
          if (!window.xnft.solana.publicKey) return;
          clearInterval(intervalId);
          resolve(true);
        }, 500);
      });

      const userIdentity = (window.xnft.solana.publicKey) ? window.xnft.solana.publicKey : new Keypair().publicKey
      const keypair = loadOrCreateGameWallet(userIdentity);

      setGameWallet(keypair);
    })();

  }, [gameWallet, setGameWallet]);

  return <>{children}</>;
};
