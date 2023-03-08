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
    if (!window.xnft.solana.publicKey) return;

    const keypair = loadOrCreateGameWallet(window.xnft.solana.publicKey);
    setGameWallet(keypair);
  }, []);

  return <>{children}</>;
};
