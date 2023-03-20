import { useRecoilValue, useSetRecoilState } from "recoil";
import { connectionAtom, gameWallet as gameWalletAtom, gameWalletBalance } from "@/recoil";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useCallback } from "react";

export const useFetchGameWalletBalance = () => {
  const gameWallet = useRecoilValue(gameWalletAtom);
  const setGameWalletBalance = useSetRecoilState(gameWalletBalance);
  const connection = useRecoilValue(connectionAtom);

  return useCallback(async () => {
    if (gameWallet) {
      const accountInfo = await connection.getAccountInfo(gameWallet.publicKey);
      if (!accountInfo) {
        console.error(`Account ${gameWallet!.publicKey.toString()} not found`);
        return;
      }
      setGameWalletBalance(accountInfo.lamports / LAMPORTS_PER_SOL);
    }
  }, [connection, gameWallet, setGameWalletBalance]);
};
