import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { StatelessSDK } from "kyogen-sdk";
import { connectionAtom } from "../recoil";

/**
 * Returns memoized instance of kyogen stateless SDK.
 */
export const useStatelessSdk = () => {
  const connection = useRecoilValue(connectionAtom);
  console.log("KYOGEN: ",  process.env.NEXT_PUBLIC_KYOGEN_ID);
  console.log("REGISTRY: ", process.env.NEXT_PUBLIC_REGISTRY_ID);
  console.log("CORE: ", process.env.NEXT_PUBLIC_COREDS_ID);
  console.log("STRUCTURES: ", process.env.NEXT_PUBLIC_STRUCTURES_ID)
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
