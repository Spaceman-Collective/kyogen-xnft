import { LOCAL_GAME_KEY } from "@/constants";
import { gameIdAtom } from "@/recoil";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useReadLocalStorage } from "usehooks-ts";

const useSetGameIdFromLocalStorage = () => {
    const localGameId = useReadLocalStorage(LOCAL_GAME_KEY) as string;
    const [gameId, setGameId] = useRecoilState(gameIdAtom);

    useEffect(() => {
        if (typeof gameId !== "undefined") return;
        if (!localGameId) return;

        setGameId(BigInt(localGameId))
        
    }, [localGameId, gameId, setGameId])
}

export default useSetGameIdFromLocalStorage;