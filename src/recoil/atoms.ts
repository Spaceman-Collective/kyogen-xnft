import { Keypair } from "@solana/web3.js";
import * as kyogenSdk from "kyogen-sdk";
import { atom } from "recoil";
import { Notification, Troop } from "@/types";

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

export const selectedUnitAtom = atom<Troop|null>({
  key: "selectedUnitAtom",
  default: null
})

////// Notifications

export const notificationsAtom = atom<Notification[]>({
  key: "notificationsAtom",
  default: []
})