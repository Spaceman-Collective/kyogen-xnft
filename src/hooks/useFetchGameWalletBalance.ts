import {useRecoilState} from "recoil";
import { gameWallet as gameWalletAtom, gameWalletBalance } from "@/recoil";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const useFetchGameWalletBalance = () => {
    const [gameWallet, _setGameWallet] = useRecoilState(gameWalletAtom);
    const [_gameWalletBalance, setGameWalletBalance] = useRecoilState(gameWalletBalance);

    return async () => {
        const connection = window.xnft.solana.connection;
        const accountInfo = await connection.getAccountInfo(gameWallet!.publicKey);
        if (!accountInfo) {
            console.error(`Account ${gameWallet!.publicKey.toString()} not found`);
            return;
        }
        setGameWalletBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
    }
}