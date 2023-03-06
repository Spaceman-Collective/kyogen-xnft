import { Keypair } from "@solana/web3.js";
import {atom} from "recoil";

export const gameWallet = atom<Keypair|null>({
    key: "gameWallet",
    default: null
})