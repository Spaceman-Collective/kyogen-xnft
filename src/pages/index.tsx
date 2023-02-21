import Head from 'next/head'
import { Navbar } from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>Kyogen Clash</title>
        <meta name="description" content="Kyogen Clash - A Solana real time strategy game powered by Dominari ARC." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <p>Home</p>
    </>
  )
}
