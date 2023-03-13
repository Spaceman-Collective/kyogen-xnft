import { Connection } from "@solana/web3.js";
import { useEffect, useMemo } from "react";
import { useSetRecoilState } from "recoil";
import { connectionAtom } from "../recoil";

/**
 * Connection wrapper to be used for xNFT and browser env.
 */
export const useSetInnerConnection = () => {
  const setConnection = useSetRecoilState(connectionAtom);

  useEffect(() => {
    if (window?.xnft?.solana) {
      setConnection(
        new Connection(window?.xnft?.solana.connection.rpcEndpoint)
      );
    }
  }, [setConnection]);
};
