import { Keypair } from "@solana/web3.js";
import {atom} from "recoil";

export const gameWallet = atom<Keypair|null>({
    key: "gameWallet",
    default: null
})

export const gameWalletBalance = atom<number>({
    key: "gameWalletBalance",
    default: 0
});