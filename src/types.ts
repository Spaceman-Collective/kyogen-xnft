import { web3 } from "@coral-xyz/anchor";
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
    version: number;
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
    signTransaction: (
      tx: web3.VersionedTransaction
    ) => Promise<web3.VersionedTransaction>;
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
export type Role = "success" | "danger" | "warning";

export interface Notification {
  role: Role;
  message: string;
}

export interface GameConfig {
  max_players: number;
  game_token: string;
  spawn_claim_multiplier: string;
  max_score: string;
}

export interface Map {
  map_id: string;
  tiles: Tile[];
  meteors: Meteor[];
  lootables: Lootable[];
  healers: Healer[];
  portals: Portal[];
}

export interface Tile {
  clan: Clans | undefined;
  troop: Troop | undefined;
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
  AncientNinja = "Ancient Shinobi",
  AncientSamurai = "Ancient Samurai",
  AncientSohei = "Ancient Sohei",
  CreeperNinja = "Creeper Shinobi",
  CreeperSamurai = "Creeper Samurai",
  CreeperSohei = "Creeper Sohei",
  SynthNinja = "Synth Shinobi",
  SynthSamurai = "Synth Samurai",
  SynthSohei = "Synth Sohei",
  WildingNinja = "Wilding Shinobi",
  WildingSamurai = "Wilding Samurai",
  WildingSohei = "Wilding Sohei",
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

export interface Troop {
  active: boolean;
  attack_range: number;
  bonus_samurai: string;
  bonus_shinobi: string;
  bonus_sohei: string;
  health: string;
  max_health: string;
  id: string;
  last_used: string;
  max_damage: string;
  min_damage: string;
  movement: string;
  name: UnitNames;
  player_id: string;
  player_key: string;
  recovery: string;
  troop_class: string;
}

export interface StructureBase {
  active: boolean;
  cost: string;
  id: string;
  last_used: string;
  name: "Meteor" | "Healer" | "Portal" | "Barracks";
  recovery: string;
  x: number;
  y: number;
}

export interface Meteor extends StructureBase {
  name: "Meteor";
  structure: {
    Meteor: {
      solarite_per_use: number;
    };
  };
}

export interface Healer extends StructureBase {
  name: "Healer";
  structure: {
    Healer: {
      heal_amt: number;
    };
  };
}

export interface Lootable extends StructureBase {
  // TODO
}

export interface Portal extends StructureBase {
  name: "Portal";
  structure: {
    Portal: {
      channel: number;
    };
  };
}

export type GameFeedItem = {
  type: string;
  players: Player[];
  msg: string;
  timestamp: number;
};

export type PlayPhase = "Lobby" | "Play" | "Paused" | "Finished";

export interface AccountChange {
  id: string;
  data: string; //b64 encoded
}

/** Kyogen Events */
// GameStateChanged
export interface EventGameStateChanged {
  name: "GameStateChanged";
  instance: string;
  newState: string; // PlayPhase (will be lowercased)
}

// NewPlayer
export interface EventNewPlayer {
  name: "NewPlayer";
  instance: string;
  player: AccountChange;
  authority: string; // Pubkey
  clan: string; // Clan
}

// SpawnClaimed
export interface EventSpawnClaimed {
  name: "SpawnClaimed";
  instance: string;
  clan: string; //Clans
  tile: AccountChange;
  player: string; // player id (no change)
}

// UnitSpawned
export interface EventUnitSpawned {
  name: "UnitSpawned";
  instance: string;
  tile: AccountChange; // occupant changed
  player: AccountChange; // card used
  unit: AccountChange; // entity created
}

// UnitMoved
export interface EventUnitMoved {
  name: "UnitMoved";
  instance: string;
  unit: AccountChange; //Last Used
  from: AccountChange; // occupant
  to: AccountChange; // occupant
}

// UnitAttacked
export interface EventUnitAttacked {
  name: "UnitAttacked";
  instance: string;
  attacker: AccountChange; //last used
  defender: AccountChange; // hp
  tile: AccountChange; // occupant if defender hp < 0
}

/** Structures Events */
// Meteor Mined
export interface EventMeteorMined {
  name: "MeteorMined";
  instance: string;
  tile: string; // no change
  meteor: AccountChange; // last used
  player: AccountChange; // score
}

// PortalUsed
export interface EventPortalUsed {
  name: "PortalUsed";
  instance: string;
  from: AccountChange; //occupant
  to: AccountChange; //occupant,
  unit: AccountChange; //last used
}

// LootableLooted
export interface EventLootableLooted {
  name: "LootableLooted";
  instance: string;
  tile: string; //no change
  lootable: AccountChange; //last used
  player: AccountChange; // card hand
}

// GameFished
export interface EventGameFinished {
  name: "GameFinished";
  instance: string;
  winning_player_id: string;
  winning_player_key: string;
  high_score: string;
}

export type KyogenEvents =
  | EventGameStateChanged
  | EventNewPlayer
  | EventSpawnClaimed
  | EventUnitSpawned
  | EventUnitMoved
  | EventUnitAttacked
  | EventMeteorMined
  | EventPortalUsed
  | EventLootableLooted
  | EventGameFinished;
