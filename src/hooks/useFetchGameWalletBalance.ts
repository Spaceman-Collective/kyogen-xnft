import { useRecoilValue, useSetRecoilState } from "recoil";
import { gameWallet as gameWalletAtom, gameWalletBalance } from "@/recoil";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback } from "react";

export const useFetchGameWalletBalance = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const setGameWalletBalance = useSetRecoilState(gameWalletBalance);

  return useCallback(async () => {
    if (gameWallet) {
      const connection = window.xnft.solana.connection;
      const accountInfo = await connection.getAccountInfo(gameWallet.publicKey);
      if (!accountInfo) {
        console.error(`Account ${gameWallet!.publicKey.toString()} not found`);
        return;
      }
      setGameWalletBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
    }
  }, [gameWallet, setGameWalletBalance]);
};
