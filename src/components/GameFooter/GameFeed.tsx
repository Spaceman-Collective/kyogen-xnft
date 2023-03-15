import { playerColorPaletteStr } from "@/constants";
import { gameFeedAtom, playerIdsAtom } from "@/recoil";
import { Player } from "@/types";
import React, { useCallback, useEffect, useRef } from "react";
import { useRecoilValue } from "recoil";

export const GameFeed = () => {
  const gameFeedState = useRecoilValue(gameFeedAtom);
  const playerIds = useRecoilValue(playerIdsAtom);
  const endGameFeedRef = useRef(null);

  const getPlayerColor = useCallback((playerId: string) => {
    const index = playerIds.indexOf(playerId);
    return playerColorPaletteStr[index] ?? "#a00";
  },[playerIds]);

  useEffect(() => {
    console.log("Game feed effect");
    if (!endGameFeedRef || !endGameFeedRef.current) return;
    // @ts-ignore
    endGameFeedRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [endGameFeedRef, gameFeedState.length])
  
  return (
    <div className="mt-3 ml-8 max-h-[260px] overflow-y-auto" >
      {gameFeedState.map(({ msg, players, timestamp }, index) => {
        const time = getFormattedTimeStamp(timestamp);
        const colors = players.map(({id}) => getPlayerColor(id))
        return (
            <p key={index}>
            <b>{time}</b>  -&gt; {messageFiller(msg, players, colors)}
            </p>
        );
      })}
      <div ref={endGameFeedRef}></div>
    </div>
  );
};

const getFormattedTimeStamp = (time: number) => {
  const date = new Date(time);
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}:${
    s < 10 ? "0" + s : s
  }`;
};

// this replaces %{playerIndex}% tags
// with italicised text in the corresponding color
const messageFiller = (msg: string, players: Player[], colors: string[]) => {
  const parts = msg.split("%");

  return (
    <span>
      {parts.map((part, index) => {
        const playerIndex = parseInt(part) - 1;
        if (Number.isNaN(playerIndex)) {
          return <span key={index}>{part}</span>;
        }
        const player = players[playerIndex];
        const color = colors[playerIndex];
        return (
          <b style={{ color }} key={index}>
            {player.name}
          </b>
        );
      })}
    </span>
  );
};
