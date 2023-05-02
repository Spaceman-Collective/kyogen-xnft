import { useEffect, useRef, useState } from "react";
import GameFooter from "@/components/GameFooter";
import useListenToGameEvents from "@/hooks/useListenToGameEvents";
import dynamic from "next/dynamic";
import { GameOverlay } from "../../components/GameOverlay";
import { useLoadGameState } from "../../hooks/useLoadGameState";
import { useTrackSlotChange } from "../../hooks/useTrackSlotChange";
import usePlayerUnitsOnMeteors from "@/hooks/usePlayerUnitsOnMeteors";
import { Howl } from 'howler'; 
import music from "../../../public/sounds/melody_63.mp3";
import { SdkLoader } from "../../components/KyogenSdkLoader";

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

const GameInner = () => {
  useLoadGameState();
  useListenToGameEvents();
  useTrackSlotChange();
  // usePlayerUnitsOnMeteors();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [containerDims, setContainerDims] = useState({ height: 0, width: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((event) => {
      // Depending on the layout, you may need to swap inlineSize with blockSize
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
      setContainerDims({
        height: event[0].contentBoxSize[0].blockSize,
        width: event[0].contentBoxSize[0].inlineSize,
      });
    });

    if (gameContainerRef.current) {
      resizeObserver.observe(gameContainerRef.current);
    }
  }, []);

  let sound = new Howl({
    src: [music],
    autoplay: false,
    loop: true
  });

  useEffect(() => {
    //sound.play();

    return () => {
      sound.unload();
    }
  }, [])
  
  return (
    <>
      <div className="flex flex-row space-x-8">
        <div className="flex flex-row ml-30 mt-10 space-x-4">
          <button onClick={() => {
            sound.pause()
          }}>Mute</button>
          <button onClick={() => {
            sound.play();
          }}>Play Music</button>
        </div>
      </div>
        
      <div className="h-screen w-screen flex flex-col">
        <div
          ref={gameContainerRef}
          className="bg-[#eae6d5] relative flex flex-1 justify-center items-center"
        >
          <GameMap height={containerDims.height} width={containerDims.width} />
          <GameOverlay />
        </div>
        <GameFooter />
      </div>
    </>
  );
};

const Game = () => {
  return (
    <SdkLoader>
      <GameInner />
    </SdkLoader>
  );
};

export default Game;
