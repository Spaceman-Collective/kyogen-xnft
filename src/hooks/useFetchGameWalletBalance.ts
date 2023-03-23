import { useRecoilValue, useSetRecoilState } from "recoil";
import { connectionAtom, gameWallet as gameWalletAtom, gameWalletBalance } from "@/recoil";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback } from "react";
import toast from "react-hot-toast";

export const useFetchGameWalletBalance = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const setGameWalletBalance = useSetRecoilState(gameWalletBalance);
  const connection = useRecoilValue(connectionAtom);

  return useCallback(async () => {
    if (gameWallet) {
      try{
        const balance = await connection.getBalance(gameWallet.publicKey);
        setGameWalletBalance(balance / LAMPORTS_PER_SOL);
      } catch (e) {
        toast.error("Couldn't fetch balance!");
        setGameWalletBalance(0);
      }
    }
  }, [connection, gameWallet, setGameWalletBalance]);
};
