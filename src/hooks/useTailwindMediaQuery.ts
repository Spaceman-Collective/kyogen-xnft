import { useMemo } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import { KeyValuePair } from "tailwindcss/types/config";
import { useWindowSize } from "usehooks-ts";
import tailwindConfig from "../../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
const screens = fullConfig.theme?.screens as KeyValuePair<string, string>;

const getBreakpointValue = (value: string): number =>
  parseInt(screens[value].slice(0, screens[value].indexOf("px")));

/**
 * Return whether or not the screen width is over the input breakpoint.
 * @param breakpoint
 */
// TODO generate string union from config
export const useTWBreakpoint = (breakpoint: string) => {
  const windowSize = useWindowSize();
  return useMemo(() => {
    const bp = getBreakpointValue(breakpoint);

    return windowSize.width >= bp;
  }, [breakpoint, windowSize.width]);
};
