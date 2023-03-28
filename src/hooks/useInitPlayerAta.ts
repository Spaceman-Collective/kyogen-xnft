import {
  connectionAtom,
  gameStateAtom,
  gameWallet as gameWalletAtom,
} from "@/recoil";
import {
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";

const useInitPlayerAta = () => {
  const gameState = useRecoilValue(gameStateAtom);
  console.log("Game State; ", gameState);
  const gameWallet = useRecoilValue(gameWalletAtom);
  console.log("Game Wallet: ", gameWallet?.publicKey.toString())
  const connection = useRecoilValue(connectionAtom);
  const sendAndConfirmTransaction = useSendAndConfirmGameWalletTransaction();

  return useCallback(async () => {
    if (!gameState || !gameWallet) {
      throw new Error("GameState or GameWallet not defined!");
    };

    const gameConfig = gameState.get_game_config();
    const gameMint = new PublicKey(gameConfig.game_token);

    const playerAta = await getOrCreateAssociatedTokenAccount(
      connection,
      gameWallet,
      gameMint,
      gameWallet.publicKey,
    );
    console.log("Player ATA: ", playerAta.address.toString());
    return playerAta.address.toString();

    /*
    // Check if the player ATA exists.
    const playerAta = await getAssociatedTokenAddress(
      gameMint,
      gameWallet.publicKey
    );
    console.log(`Player ATA ${playerAta}`);
    const accountInfo = await connection.getAccountInfo(playerAta);
    console.log(`Account data`, accountInfo);
    if (!accountInfo) {
      const ix = createAssociatedTokenAccountInstruction(
        gameWallet.publicKey,
        playerAta,
        gameWallet.publicKey,
        gameMint
      );
      const txId = await sendAndConfirmTransaction([ix]);
      console.log(`Player ATA created: ${txId}`);
    }
    */
  }, [connection, gameState, gameWallet, sendAndConfirmTransaction]);
};

export default useInitPlayerAta;
