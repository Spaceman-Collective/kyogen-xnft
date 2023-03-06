"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";

import "@solana/wallet-adapter-react-ui/styles.css";
import { gameWallet as gameWalletAtom } from "../recoil/atoms";
import { loadOrCreateGameWallet } from "@/utils/gameWallet";

const endpoint = "http://localhost:8899";
export const SolanaProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallets = useMemo(() => [], []);
  const setGameWallet = useSetRecoilState(gameWalletAtom);

  useEffect(() => {
    const keypair = loadOrCreateGameWallet();
    setGameWallet(keypair);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app's components go here, nested within the context providers. */}
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
