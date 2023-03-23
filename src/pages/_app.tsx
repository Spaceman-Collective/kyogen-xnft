import "@/styles/globals.css";
import "@/styles/solanaOverrides.css";
import type { AppProps } from "next/app";
import { SolanaProviders } from "../components/SolanaProviders";
import {
  RecoilRoot,
} from "recoil";
import "public/fonts/fontstyles.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Toaster position="top-right" reverseOrder={true}/>
      <SolanaProviders>
        <Component {...pageProps} />
      </SolanaProviders>
    </RecoilRoot>
  );
}
