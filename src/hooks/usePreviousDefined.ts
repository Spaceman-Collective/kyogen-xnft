import { useEffect, useRef } from "react";

export const usePreviousDefined = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    if (!!value) ref.current = value;
  }, [value]);

  return ref.current;
};
