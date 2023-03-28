import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { connectionAtom } from "../recoil";
import toast from "react-hot-toast";

export const useCanAirdrop = () => {
  const connection = useRecoilValue(connectionAtom);

  return useMemo(() => {
    return (
      connection.rpcEndpoint.includes("devnet") ||
      connection.rpcEndpoint.includes("localhost") ||
      connection.rpcEndpoint.includes("127.0.0.1") ||
      connection.rpcEndpoint.includes("helius") // Done for private chains 
    );
  }, [connection.rpcEndpoint]);
};

export const useAirdrop = () => {
  const connection = useRecoilValue(connectionAtom);

  return useCallback(
    async (address: PublicKey) => {
      try {
        const latestBlockInfo = await connection.getLatestBlockhash();
        const txSig = await connection.requestAirdrop(address, LAMPORTS_PER_SOL);
        console.log("Airdrop Sig: ", txSig);
        const confirmationStrategy = {
          signature: txSig,
          blockhash: latestBlockInfo.blockhash,
          lastValidBlockHeight: latestBlockInfo.lastValidBlockHeight + 5, // was 50
        };
        return connection.confirmTransaction(confirmationStrategy);  
      } catch (e) {
        toast.error("Airdrop failed!");
        // Do i need to throw e?
      }
    },
    [connection]
  );
};
