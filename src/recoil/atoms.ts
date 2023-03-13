import { Connection, Keypair } from "@solana/web3.js";
import * as kyogenSdk from "kyogen-sdk";
import { atom, atomFamily } from "recoil";
import { Notification, Player, Tile, Troop } from "@/types";

export const gameIdAtom = atom<bigint | undefined>({
  key: "gameIdAtom",
  default: undefined,
});

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

export const selectedTileIdAtom = atom<string>({
  key: "selectedTileIdAtom",
  default: "",
});

export const tilesAtomFamily = atomFamily<Tile | null, string>({
  key: "tilesAtomFamily",
  default: null,
});

export const tileIdsAtom = atom<string[]>({
  key: "tileIdsAtom",
  default: [],
});

export const playersAtomFamily = atomFamily<Player | null, string>({
  key: "playersAtomFamily",
  default: null,
});

export const playerIdsAtom = atom<string[]>({
  key: "playerIdsAtom",
  default: [],
});

// not sure if we need this yet since it's on the Tile state
export const troopsAtomFamily = atomFamily<Troop | null, string>({
  key: "troopsAtomFamily",
  default: null,
});

////// Notifications

export const notificationsAtom = atom<Notification[]>({
  key: "notificationsAtom",
  default: [],
});

/* Local solana state */
export const connectionAtom = atom({
  key: "connectionAtom",
  default: new Connection("http://localhost:8899"),
  // connection mutates itself, so must have this
  dangerouslyAllowMutability: true,
});

export const currentSlotAtom = atom({
  key: "currentSlotAtom",
  default: 0,
});

export const gameFeedAtom = atom<GameFeedItem[]>({
  key: "gameFeedAtom",
  default: []
})

export type GameFeedItem = {
  type:string,
  players: string[],
  msg: string,
  timestamp: number,
}