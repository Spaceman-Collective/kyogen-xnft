import { loadOrCreateGameWallet } from "@/utils/gameWallet";
import { Keypair } from "@solana/web3.js";
import { createContext, useContext, useEffect, useState } from "react";


const GameWalletContext = createContext<{keypair?: Keypair}>({});

export const GameWalletProvider = ({children}: {children: React.ReactNode}) => {
    const [gameWallet, setGameWallet] = useState<Keypair>();

    useEffect(() => {
        const keypair = loadOrCreateGameWallet();
        setGameWallet(keypair);
    }, [])

    return <GameWalletContext.Provider value={{keypair: gameWallet}}>{children}</GameWalletContext.Provider>
}

export const useGameWallet = () => useContext(GameWalletContext)
