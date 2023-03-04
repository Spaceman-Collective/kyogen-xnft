"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
import { GameWalletProvider } from "@/context/GameWalletContext";

const endpoint = "http://localhost:8899";
export const SolanaProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <GameWalletProvider>
          <WalletModalProvider>
            {/* Your app's components go here, nested within the context providers. */}
            {children}
          </WalletModalProvider>
        </GameWalletProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
