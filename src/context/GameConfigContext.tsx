import { createContext, useContext } from "react";

const GameConfigContext = createContext<{ height: number; width: number }>({
  height: 8,
  width: 8,
});

// TODO load from game config
const val = { height: 8, width: 8 };
export const GameConfigProvider = ({ children }: { children: React.ReactNode }) => {
  return <GameConfigContext.Provider value={val}>{children}</GameConfigContext.Provider>;
};

export const useGameConfig = () => useContext(GameConfigContext);
