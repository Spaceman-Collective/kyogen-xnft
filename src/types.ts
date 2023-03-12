import {
  Commitment,
  ConfirmOptions,
  Connection,
  PublicKey,
  SendOptions,
  Signer,
  SimulatedTransactionResponse,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";

export type xnft = {
  metadata: {
    avatarUrl: string;
    isDarkMode: boolean;
    jwt: string;
    userId: string;
    username: string;
    version: number
  };
  ethereum: {};
  solana: {
    connection: Connection;
    publicKey: PublicKey;
    send: (
      tx: Transaction,
      signers?: Signer[],
      opts?: SendOptions
    ) => Promise<TransactionSignature>;
    sendAndConfirm: (
      tx: Transaction,
      signers?: Signer[],
      opts?: ConfirmOptions
    ) => Promise<TransactionSignature>;
    //   signMessage:
    //   signTransaction:
    simulate: (
      tx: Transaction,
      signers?: Signer[],
      commitment?: Commitment,
      includeAccounts?: boolean | PublicKey[]
    ) => Promise<Omit<SimulatedTransactionResponse, "err">>;
  };
};

declare global {
  interface Window {
    xnft: xnft;
  }
}

export interface Map {
  map_id: string;
  structures: unknown[];
  tiles: Tile[];
}

export interface Tile {
  clan: Clans;
  troop: unknown;
  spawnable: boolean;
  x: number;
  y: number;
}

export enum Clans {
  Ancients = "Ancients",
  Wildings = "Wildings",
  Creepers = "Creepers",
  Synths = "Synths",
}

// Ninja named Shinobi due to set up scripts
export enum UnitNames {
  AncientNinja = 'Ancient Shinobi',
  AncientSamurai = 'Ancient Samurai',
  AncientSohei = 'Ancient Sohei',
  CreeperNinja = 'Creeper Shinobi',
  CreeperSamurai = 'Creeper Samurai',
  CreeperSohei = 'Creeper Sohei',
  SynthNinja = 'Synth Shinobi',
  SynthSamurai = 'Synth Samurai',
  SynthSohei = 'Synth Sohei',
  WildingNinja = 'Wilding Shinobi',
  WildingSamurai = 'Wilding Samurai',
  WildingSohei = 'Wilding Sohei',
}

export interface Player {
  cards: string[];
  clan: Clans;
  id: string;
  name: string;
  owner: string;
  score: string;
  solarite: string;
}
