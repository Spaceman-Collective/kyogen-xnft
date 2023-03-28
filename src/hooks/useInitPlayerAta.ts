import {
  connectionAtom,
  gameStateAtom,
  gameWallet as gameWalletAtom,
} from "@/recoil";
import { associatedAddress } from "@coral-xyz/anchor/dist/cjs/utils/token";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { useCallback } from "react";
import { useRecoilValue } from "recoil";
import { useSendAndConfirmGameWalletTransaction } from "./useSendTransaction";

const useInitPlayerAta = () => {
  const gameState = useRecoilValue(gameStateAtom);
  const gameWallet = useRecoilValue(gameWalletAtom);
  const connection = useRecoilValue(connectionAtom);
  const sendAndConfirmTransaction = useSendAndConfirmGameWalletTransaction();

  return useCallback(async () => {
    if (!gameState || !gameWallet) return;
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
