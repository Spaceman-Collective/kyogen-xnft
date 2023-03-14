"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo } from "react";

import "@solana/wallet-adapter-react-ui/styles.css";
import { XnftGameWalletProvider } from "@/context/GameWalletProvider";
import { useSetInnerConnection } from "../hooks/useSetInnerConnection";

const endpoint = "http://localhost:8899";

export const SolanaProviders = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  useSetInnerConnection();
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app's components go here, nested within the context providers. */}
          <XnftGameWalletProvider>{children}</XnftGameWalletProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
