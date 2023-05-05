import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { StatelessSDK } from "kyogen-sdk";
import { connectionAtom } from "../recoil";

/**
 * Returns memoized instance of kyogen stateless SDK.
 */
export const useStatelessSdk = () => {
  const connection = useRecoilValue(connectionAtom);

  return useMemo(
    () =>
      new StatelessSDK(
        connection.rpcEndpoint,
        process.env.NEXT_PUBLIC_KYOGEN_ID as string,
        process.env.NEXT_PUBLIC_REGISTRY_ID as string,
        process.env.NEXT_PUBLIC_COREDS_ID as string,
        process.env.NEXT_PUBLIC_STRUCTURES_ID as string
      ),
    [connection.rpcEndpoint]
  );
};
