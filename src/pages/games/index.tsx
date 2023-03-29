import { useEffect, useRef, useState } from "react";
import GameFooter from "@/components/GameFooter";
import useListenToGameEvents from "@/hooks/useListenToGameEvents";
import dynamic from "next/dynamic";
import { GameOverlay } from "../../components/GameOverlay";
import { useLoadGameState } from "../../hooks/useLoadGameState";
import { useTrackSlotChange } from "../../hooks/useTrackSlotChange";
import usePlayerUnitsOnMeteors from "@/hooks/usePlayerUnitsOnMeteors";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { connectionAtom } from "@/recoil";
import { Connection } from "@solana/web3.js";
import toast from "react-hot-toast";
import { Howl } from 'howler'; 
import music from "../../../public/sounds/melody_63.mp3";

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

  const rpcRef = useRef<HTMLInputElement>(null);
  const setConnection = useSetRecoilState(connectionAtom);
  const connection = useRecoilValue(connectionAtom);
  
  useEffect(() => {
    let sound = new Howl({
      src: [music],
      autoplay: true,
      loop: true
    });

    sound.on("play-bg-music", () => {
      sound.play();
    });

    sound.on("mute-bg-music", () => {
      sound.mute();
    });

    return () => {
      sound.unload();
    }
  }, [])
  
  return (
    <>
      <div className="flex flex-row space-x-8">
        <div className="flex flex-row ml-24 mt-10 space-x-4">
          <label>RPC Endpoint: </label>
          <input
            className="text-black"
            type="string"
            ref={rpcRef}
          ></input>
          <button onClick={
            async () => { 
              try{ 
                setConnection(new Connection(rpcRef.current!.value))
                toast.success(`RPC Endpoint Updated!`);  
              } catch (e) {
                toast.error("RPC Invalid!");
              }
            }
          }>Save RPC</button>
        </div> 

        <div className="flex flex-row ml-30 mt-10 space-x-4">
          <button onClick={() => {
            document.dispatchEvent(new Event("mute-bg-music"))
          }}>Mute</button>
          <button onClick={() => {
            document.dispatchEvent(new Event("play-bg-music"))
          }}>Unmute</button>
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

export default Game;
