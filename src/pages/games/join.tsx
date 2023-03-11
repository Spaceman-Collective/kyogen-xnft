import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextInput } from "@/components/inputs/TextInput";
import Page from "@/components/Page";
import { gameIdAtom } from "@/recoil";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useRecoilState } from "recoil";

const JoinGamePage = () => {
  const router = useRouter();
  const [gameId, setGameId] = useRecoilState(gameIdAtom);

  const handleEnterGame = useCallback(() => {
    if (!gameId || gameId === "") {
      console.error("GameID cannot be blank");
      return;
    }
    // TODO: [nice to have] Check if game instance if valid on the blockchain
    router.push("/fundWallet");
  }, [gameId]);
  return (
    <Page title="JOIN GAME">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row justify-center items-center mt-20">
          <p className="mr-3 text-2xl">Enter Game ID:</p>
          <TextInput
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
          />
        </div>
        <PrimaryButton className="mt-5" onClick={handleEnterGame}>
          Join Game
        </PrimaryButton>
      </div>
    </Page>
  );
};
export default JoinGamePage;
