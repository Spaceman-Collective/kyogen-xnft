import { useEffect, useState } from "react";
import InitKyogenSdk from "kyogen-sdk";

export const SdkLoader = ({ children }: { children: React.ReactNode }) => {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    (async () => {
      await InitKyogenSdk();
      setLoad(false);
    })();
  }, []);

  if (load) {
    return null;
  }

  return <>{children}</>;
};
