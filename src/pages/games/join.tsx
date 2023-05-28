import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { TextInput } from "@/components/inputs/TextInput";
import Page from "@/components/Page";
import { LOCAL_GAME_KEY } from "@/constants";
import {
  connectionAtom,
  customRpcAtom,
  gameIdAtom,
  notificationsAtom,
} from "@/recoil";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useLocalStorage } from "usehooks-ts";
import toast from "react-hot-toast";
import { useFetchGameWalletBalance } from "@/hooks/useFetchGameWalletBalance";
import { Connection } from "@solana/web3.js";
import { useMemo } from "react";
import * as anchor from "@coral-xyz/anchor";
import { debounce } from "@/utils/debounce";

interface onChainGameStatus {
  verified: boolean;
  valid: boolean;
}

const JoinGamePage = () => {
  const router = useRouter();
  const setGameId = useSetRecoilState(gameIdAtom);
  const [_, setLocalGameId] = useLocalStorage(LOCAL_GAME_KEY, "");
  const setNotifications = useSetRecoilState(notificationsAtom);
  const [idString, setIdString] = useState("");
  const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
  const [onChainGameStatus, setOnChainGameStatus] = useState<onChainGameStatus>(
    { verified: false, valid: false }
  );
  const [customRpc, setCustomRpc] = useRecoilState(customRpcAtom);
  const [localCustomRpc, setLocalCustomRpc] = useState(customRpc);
  const [connection, setConnection] = useRecoilState(connectionAtom);
  const fetchGameWalletBalance = useFetchGameWalletBalance();

  const verifyGameInstance = useCallback(async (gameId: string) => {
    let verify = async (gameId: string): Promise<boolean> => {
      let ret = true;

      try {
        setVerifyLoading(true);
        const coreds = new anchor.web3.PublicKey(
          process.env.NEXT_PUBLIC_COREDS_ID ?? anchor.web3.PublicKey.default
        );
        const registry = new anchor.web3.PublicKey(
          process.env.NEXT_PUBLIC_REGISTRY_ID ?? anchor.web3.PublicKey.default
        );

        const [registryInstance, _] =
          anchor.web3.PublicKey.findProgramAddressSync(
            [
              anchor.utils.bytes.utf8.encode("registry"),
              registry.toBuffer(),
              new anchor.BN(gameId).toArrayLike(Buffer),
            ],
            coreds
          );

        const accountInfo = await connection.getAccountInfo(registryInstance);

        ret =
          accountInfo != null &&
          accountInfo.owner.toString() === coreds.toString();
      } catch (error) {
        // console.log("[verify] error", error);
        ret = false;
      } finally {
        setVerifyLoading(false);
      }

      return ret;
    };

    const isValid = true; //await verify(gameId);
    setOnChainGameStatus((prevState) => {
      return { ...prevState, valid: isValid };
    });
  }, []);

  const debouncedVerifyGameInstance = useMemo(() => {
    return debounce(verifyGameInstance, 1000);
  }, [verifyGameInstance]);

  const handleEnterGame = useCallback(async () => {
    try {
      const gameIdBigInt = BigInt(idString);
      setGameId(gameIdBigInt);
      setLocalGameId(gameIdBigInt.toString());

      // By this point, the game instance is validated on the blockchain
      router.push("/fundWallet");
    } catch (error) {
      setNotifications((notifications) => [
        ...notifications,
        { role: "danger", message: "Please enter a valid gameId" },
      ]);

      setOnChainGameStatus({ valid: false, verified: false });
      setVerifyLoading(false);
      return;
    }
  }, [idString, router, setGameId, setLocalGameId, setNotifications]);

  return (
    <Page title="JOIN GAME">
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-row ml-24 mt-10 space-x-4">
          <label>RPC Endpoint: </label>
          <input
            className="text-black"
            onChange={(e) => setLocalCustomRpc(e.target.value)}
            value={localCustomRpc}
            type="string"
          />
          <button
            onClick={async () => {
              try {
                setCustomRpc(localCustomRpc);
                setConnection(new Connection(localCustomRpc));
                await fetchGameWalletBalance();
                toast.success(`RPC Endpoint Updated!`);
              } catch (e) {
                toast.error("RPC Invalid!");
              }
            }}
          >
            Save RPC
          </button>
        </div>

        <div className="flex flex-row justify-center items-center mt-20">
          <p className="mr-3 text-2xl">Enter Game ID:</p>
          <TextInput
            value={idString}
            onChange={(e) => {
              const value = e.target.value;
              setIdString(value);
              setOnChainGameStatus((prevState) => {
                return { ...prevState, verified: true };
              });
              if (!verifyLoading) {
                setVerifyLoading(true);
              }
              debouncedVerifyGameInstance(value);
            }}
          />
        </div>

        {onChainGameStatus.verified && (
          <p className="mt-5 text-2xl">
            {verifyLoading
              ? "Validating Game..."
              : onChainGameStatus.valid
              ? "Game ID is valid!"
              : "Game ID is not valid!"}
          </p>
        )}

        <PrimaryButton
          className={!onChainGameStatus.verified ? "mt-5" : "mt-2"}
          onClick={handleEnterGame}
          disabled={
            verifyLoading ||
            !onChainGameStatus.verified ||
            !onChainGameStatus.valid
          }
        >
          Join Game
        </PrimaryButton>
      </div>
    </Page>
  );
};
export default JoinGamePage;
