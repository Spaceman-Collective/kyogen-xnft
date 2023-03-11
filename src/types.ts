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
  Ancients = 'Ancients',
  Wildings = 'Wildings',
  Creepers = 'Creepers',
  Synths = 'Synths',
}
