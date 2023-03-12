import { Keypair } from "@solana/web3.js";
import * as kyogenSdk from "kyogen-sdk";
import { atom } from "recoil";

export const gameIdAtom = atom<bigint|undefined>({
  key: "gameIdAtom",
  default: undefined,
})

export const gameWallet = atom<Keypair | null>({
  key: "gameWallet",
  default: null,
});

export const gameWalletBalance = atom<number>({
  key: "gameWalletBalance",
  default: 0,
});

export const gameStateAtom = atom<kyogenSdk.GameState | null>({
  key: "gameStateAtom",
  default: null,
  dangerouslyAllowMutability: true,
});
