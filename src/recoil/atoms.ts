import { Connection, Keypair } from "@solana/web3.js";
import * as kyogenSdk from "kyogen-sdk";
import * as PIXI from "pixi.js";
import { atom, atomFamily } from "recoil";
import { GameFeedItem, PlayPhase, Healer, Meteor, Notification, Player, Tile, Troop } from "@/types";
import { MutableRefObject } from "react";

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

export const troopsAtomFamily = atomFamily<Troop | null, string>({
  key: "troopsAtomFamily",
  default: null,
});

export const troopIdsAtom = atom<string[]>({
  key: "troopIdsAtom",
  default: [],
});

export const meteorsAtomFamily = atomFamily<Meteor | null, string>({
  key: "meteorsAtomFamily",
  default: null,
});

export const meteorIdsAtom = atom<string[]>({
  key: "meteorIdsAtom",
  default: [],
});

export const healersAtomFamily = atomFamily<Healer | null, string>({
  key: "healersAtomFamily",
  default: null,
});

export const healerIdsAtom = atom<string[]>({
  key: "healerIdsAtom",
  default: [],
});

///// UI state (I admit this is an odd pattern) ///
export const troopContainerRefAtomFamily = atomFamily<
  MutableRefObject<PIXI.DisplayObject | null> | null,
  string
>({
  key: "troopContainerRefAtomFamily",
  default: null,
  dangerouslyAllowMutability: true,
});

////// Notifications

export const notificationsAtom = atom<Notification[]>({
  key: "notificationsAtom",
  default: [],
});

/* Local solana state */
export const connectionAtom = atom({
  key: "connectionAtom",
  default: new Connection("https://rpc-devnet.helius.xyz/?api-key=1b21b073-a222-47bb-8628-564145e58f4e"),
  // connection mutates itself, so must have this
  dangerouslyAllowMutability: true,
});

export const currentSlotAtom = atom({
  key: "currentSlotAtom",
  default: 0,
});

export const gameFeedAtom = atom<GameFeedItem[]>({
  key: "gameFeedAtom",
  default: [],
})

export const playPhaseAtom = atom<PlayPhase>({
  key: "playPhaseAtom",
  default: "Play",
})

