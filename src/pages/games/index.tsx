import dynamic from "next/dynamic";
import { GameConfigProvider } from "../../context/GameConfigContext";

// must use dynamic imports as `pixi-viewport` expects window object.
const GameMap = dynamic({
  loader: async () => {
    if (typeof window === "undefined") {
      return () => null;
    }
    const GameMapExp = await import("../../components/GameMap");
    return GameMapExp.GameMap;
  },
  ssr: false,
});

const Game = () => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <p>Game instance</p>
      <div className="flex flex-1 justify-center items-center">
        <GameConfigProvider>
          <GameMap />
        </GameConfigProvider>
      </div>
    </div>
  );
};

export default Game;
