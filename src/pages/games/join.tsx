import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextInput } from "@/components/inputs/TextInput";
import Page from "@/components/Page";
import { LOCAL_GAME_KEY } from "@/constants";
import { connectionAtom, gameIdAtom, notificationsAtom } from "@/recoil";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useLocalStorage } from "usehooks-ts";
import toast from "react-hot-toast";
import { useFetchGameWalletBalance } from "@/hooks/useFetchGameWalletBalance";
import { Connection } from "@solana/web3.js";

const JoinGamePage = () => {
  const router = useRouter();
  const setGameId = useSetRecoilState(gameIdAtom);
  const [_, setLocalGameId] = useLocalStorage(LOCAL_GAME_KEY, "");
  const setNotifications = useSetRecoilState(notificationsAtom);
  const [idString, setIdString] = useState("");
  const rpcRef = useRef<HTMLInputElement>(null);
  const setConnection = useSetRecoilState(connectionAtom);
  const connection = useRecoilValue(connectionAtom);
  const fetchGameWalletBalance = useFetchGameWalletBalance();


  const handleEnterGame = useCallback(() => {
    try {
      const gameIdBigInt = BigInt(idString);
      setGameId(gameIdBigInt);
      setLocalGameId(gameIdBigInt.toString());
      // TODO: [nice to have] Check if game instance is valid on the blockchain
      router.push("/fundWallet");
    } catch (error) {
      setNotifications((notifications) => [
        ...notifications,
        { role: "danger", message: "Please enter a valid gameId" },
      ]);
      return;
    }
  }, [idString, router, setGameId, setLocalGameId, setNotifications]);

  return (
    <Page title="JOIN GAME">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row ml-24 mt-10 space-x-4">
          <label>RPC Endpoint: </label>
          <input
            className="text-right"
            type="string"
            defaultValue={connection.rpcEndpoint}
            ref={rpcRef}
          ></input>
          <button onClick={
            async () => { 
              try{ 
                setConnection(new Connection(rpcRef.current!.value))
                await fetchGameWalletBalance();
                toast.success(`RPC Endpoint Updated!`);  
              } catch (e) {
                toast.error("RPC Invalid!");
              }
            }
          }>Save RPC</button>
        </div>        
        <div className="flex flex-row justify-center items-center mt-20">
          <p className="mr-3 text-2xl">Enter Game ID:</p>
          <TextInput
            value={idString}
            onChange={(e) => setIdString(e.target.value)}
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
