import Head from "next/head";
import Image from "next/image";
import KyogenLogo from "../../public/kyogen-logo.svg";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kyogen Clash</title>
        <meta
          name="description"
          content="Kyogen Clash - A Solana real time strategy game powered by Dominari ARC."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Navbar /> */}
      <div className="absolute top-0 bottom-0 left-0 right-0 bg-white bg-contain bg-center bg-no-repeat bg-[url('/bg_loading_screen_2x.webp')] z-10 flex">
        <div className="flex-grow grid overflow-y-auto scrollbar-hide">
          <Image
            src={KyogenLogo}
            width={290}
            height={290}
            alt="Kyogen Clash"
            className="mt-4 mx-auto"
          />

          <div className="self-center justify-self-center w-fit">
            <PrimaryButton className="flex justify-center mb-3">
              <Link
                href="/games/new"
                className="mt-1 block text-right text-white hover:text-opacity-50 lg:mt-1 lg:inline-block"
              >
                New Game
              </Link>
            </PrimaryButton>

            <PrimaryButton className="flex justify-center mb-3">
              <Link
                href="/games"
                className="mt-1 block text-right text-white hover:text-opacity-50 lg:mt-1 lg:inline-block"
              >
                Continue
              </Link>
            </PrimaryButton>
            <PrimaryButton className="flex justify-center mb-3">
              <Link
                href="/games/join"
                className="mt-1 block text-right text-white hover:text-opacity-50 lg:mt-1 lg:inline-block"
              >
                Join game
              </Link>
            </PrimaryButton>
            <WalletMultiButton
              style={{
                width: 120,
                fontSize: 12,
                padding: 21,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
