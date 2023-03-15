import { gameStateAtom } from "@/recoil";
import { Player } from "@/types";
import Image from "next/image";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import KyogenLogo from "../../../public/kyogen-logo.svg";

export const GameEndScreen = () => {
    const gameState = useRecoilValue(gameStateAtom);
    const leaderboard = useMemo(() => {
        const players = gameState?.get_players() ?? [] as Player[];
        return players.sort((a: Player,b: Player) => Number(b.score) - Number(a.score))
    }, [gameState]) as Player[]
    return (
        <div
        className="flex"
        style={{
            width: "100vw",
            height: "100vh",
            background: "#121212d3",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 60,
        }}
        >
        <Image
            src={KyogenLogo}
            width={230}
            height={230}
            alt="Kyogen Clash"
            className="mt-4 mx-20 fixed"
        />
        <p className="mx-auto mt-20 text-[#FF3D46] font-millimetre uppercase text-6xl">
            score
        </p>
        <div className="mx-[30%] scoreBoard mt-56 text-[#000]">
            <table className="table-fixed  min-w-full">
                <tbody>
                {leaderboard.map((p,index) => {
                    return (
                    <tr key={p.id}>

                        <td>{index+1}</td>
                        <td>{p.name}</td>
                        <td>{p.clan}</td>
                        <td>{p.score}</td>
                    </tr>)
                })}
                </tbody>
            </table>
        </div>
        </div>
    );
};
