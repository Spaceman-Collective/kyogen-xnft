import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useCallback, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { connectionAtom } from "../recoil";

export const useCanAirdrop = () => {
  const connection = useRecoilValue(connectionAtom);

  return useMemo(() => {
    return (
      connection.rpcEndpoint.includes("devnet") ||
      connection.rpcEndpoint.includes("localhost") ||
      connection.rpcEndpoint.includes("127.0.0.1")
    );
  }, [connection.rpcEndpoint]);
};

export const useAirdrop = () => {
  const connection = useRecoilValue(connectionAtom);

  return useCallback(
    async (address: PublicKey) => {
      const latestBlockInfo = await connection.getLatestBlockhash();
      const txSig = await connection.requestAirdrop(address, LAMPORTS_PER_SOL);
      const confirmationStrategy = {
        signature: txSig,
        blockhash: latestBlockInfo.blockhash,
        lastValidBlockHeight: latestBlockInfo.lastValidBlockHeight + 50,
      };
      return connection.confirmTransaction(confirmationStrategy);
    },
    [connection]
  );
};
