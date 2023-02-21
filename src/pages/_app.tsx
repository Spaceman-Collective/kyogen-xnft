import "@/styles/globals.css";
import '@/styles/solanaOverrides.css';

import type { AppProps } from "next/app";
import { SolanaProviders } from "../components/SolanaProviders";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SolanaProviders>
      <Component {...pageProps} />
    </SolanaProviders>
  );
}
