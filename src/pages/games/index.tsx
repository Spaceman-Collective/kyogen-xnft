import dynamic from "next/dynamic";
import { OnboardingUserGate } from "../../components/OnboardingUserGate";
import { useLoadGameState } from "../../hooks/useLoadGameState";

// // must use dynamic imports as `pixi-viewport` expects window object.
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
  useLoadGameState("15854314632436714090");

  return (
    <>
      <div className="h-screen w-screen flex flex-col">
        <p>Game instance</p>
        <div className="flex flex-1 justify-center items-center">
          <GameMap />
        </div>
      </div>
      <OnboardingUserGate />
    </>
  );
};

export default Game;
