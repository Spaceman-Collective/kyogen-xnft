// import { readFileSync } from 'fs';
// import YAML from 'yaml'
import * as anchor from '@coral-xyz/anchor'
import * as spl from '@solana/spl-token'
import { Registry, Kyogen, Structures, GameState } from 'kyogen-sdk';
import { ixPack, ixWasmToJs, randomU64 } from './wasm';

export async function create_mint(
  connection: anchor.web3.Connection,
  payer: anchor.web3.Keypair | null
): Promise<anchor.web3.PublicKey | null> {
  // Create the Mint
  if (!payer) return null;

  const mintAddress = await spl.createMint(
    connection,
    payer,
    payer.publicKey,
    payer.publicKey,
    9
  );

  return mintAddress;
}

export async function mint_spl(
  connection: anchor.web3.Connection,
  structuresSdk: Structures,
  instance: bigint,
  payer: anchor.web3.Keypair,
  configJson: any
) {
  if (!payer) return;

  // Mint Max Token Amount into ATA for Structures Index
  let si = new anchor.web3.PublicKey(
    structuresSdk.get_structures_index(instance)
  );
  let mint = new anchor.web3.PublicKey(configJson.game_token);

  let structures_ata = await spl.getAssociatedTokenAddress(mint, si, true);

  await spl.mintTo(
    connection,
    payer,
    mint,
    structures_ata,
    payer.publicKey,
    configJson.tokens_minted
  );

}

export async function append_registry_index(
  connection: anchor.web3.Connection,
  registry: Registry,
  instance: bigint,
  kyogenId: string,
  structuresId: string,
  gameWallet: anchor.web3.Keypair | null
) {
  if (!gameWallet) return;

  // Append Kyogen Action Bundles
  const appendKyogenIx = ixWasmToJs(
    registry.append_registry_index(
      Kyogen.get_kyogen_signer_str(kyogenId),
      instance
    )
  );

  // Append Structures Action Bundles
  const appendStructuresIx = ixWasmToJs(
    registry.append_registry_index(
      Structures.get_structures_signer_str(structuresId),
      instance
    )
  );

  const msg = new anchor.web3.TransactionMessage({
    payerKey: gameWallet.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: [appendKyogenIx, appendStructuresIx],
  }).compileToLegacyMessage();

  const tx = new anchor.web3.VersionedTransaction(msg);
  tx.sign([gameWallet]);
  const sig = await connection.sendTransaction(tx);
  await connection.confirmTransaction(sig);

  console.log("Action bundles registered with instance...");
}

export async function init_structures(
  connection: anchor.web3.Connection,
  gameState: GameState,
  structuresSdk: Structures,
  instance: bigint,
  gameWallet: anchor.web3.Keypair | null,
  config: any
) {
  if (!gameWallet) return;

  let ixs = [];

  for (let s of config.structures) {
    ixs.push(
      ixWasmToJs(
        structuresSdk.init_structure(
          instance,
          randomU64(),
          BigInt(gameState.get_tile_id(s.x, s.y)),
          s.x,
          s.y,
          gameState.get_blueprint_key(s.structure_blueprint)
        )
      )
    );
  }

  let ix_groups = await ixPack(ixs);
  let tx_group = [];
  for (let group of ix_groups) {
    const msg = new anchor.web3.TransactionMessage({
      payerKey: gameWallet.publicKey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions: group,
    }).compileToLegacyMessage();
    const tx = new anchor.web3.VersionedTransaction(msg);
    tx.sign([gameWallet]);
    let sig = await connection.sendTransaction(tx);
    tx_group.push(connection.confirmTransaction(sig));
  }

  await Promise.all(tx_group).then(() => {
    console.log("Structures created!");
  });
}

export async function init_structure_index(
  connection: anchor.web3.Connection,
  structures: Structures,
  instance: bigint,
  payer: anchor.web3.Keypair,
  config: any
) {
  const ix = ixWasmToJs(
    structures.init_structure_index(instance, config.game_token)
  );
  const msg = new anchor.web3.TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: [ix],
  }).compileToLegacyMessage();
  const tx = new anchor.web3.VersionedTransaction(msg);
  tx.sign([payer]);
  const sig = await connection.sendTransaction(tx);
  await connection.confirmTransaction(sig);
  console.log(`Structure Index created: ${sig}`);
}

export async function init_map(
  connection: anchor.web3.Connection,
  kyogenSdk: Kyogen,
  instance: bigint,
  gameWallet: anchor.web3.Keypair | null,
  configJson: any
) {
  if (!gameWallet) return;

  const mapId = randomU64();
  const initMapIx = ixWasmToJs(
    kyogenSdk.init_map(
      instance,
      mapId,
      configJson.mapmeta.max_x,
      configJson.mapmeta.max_y
    )
  );

  const msg = new anchor.web3.TransactionMessage({
    payerKey: gameWallet.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
    instructions: [initMapIx],
  }).compileToLegacyMessage();
  const tx = new anchor.web3.VersionedTransaction(msg);
  tx.sign([gameWallet]);
  const sig = await connection.sendTransaction(tx);
  await connection.confirmTransaction(sig);

  console.log(`Map ${mapId.toString()} initialized: ${sig}`);
}

export async function init_tiles(
  connection: anchor.web3.Connection,
  kyogenSdk: Kyogen,
  instance: bigint,
  gameWallet: anchor.web3.Keypair | null,
  config: any
) {
  if (!gameWallet) return;

  let tileIxGroup = [];
  for (let x = 0; x < config.mapmeta.max_x; x++) {
    for (let y = 0; y < config.mapmeta.max_y; y++) {
      let tileId = randomU64();
      const possibleSpawn = config.spawns.find((spawn: any) => {
        if (spawn.x == x && spawn.y == y) {
          return spawn;
        } else {
          return undefined;
        }
      });

      let spawnable = possibleSpawn ? true : false;
      let spawnCost = possibleSpawn ? BigInt(possibleSpawn.cost) : BigInt(0);
      let clan = possibleSpawn ? possibleSpawn.clan : "";

      const initTileIx = ixWasmToJs(
        kyogenSdk.init_tile(instance, tileId, x, y, spawnable, spawnCost, clan)
      );
      tileIxGroup.push(initTileIx);
    }
  }

  let ix_groups = await ixPack(tileIxGroup);
  let tx_group = [];
  for (let group of ix_groups) {
    const msg = new anchor.web3.TransactionMessage({
      payerKey: gameWallet.publicKey,
      recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
      instructions: group,
    }).compileToLegacyMessage();
    const tx = new anchor.web3.VersionedTransaction(msg);
    tx.sign([gameWallet]);
    let sig = await connection.sendTransaction(tx);
    tx_group.push(connection.confirmTransaction(sig));
  }
  await Promise.all(tx_group).then(() => {
    console.log("Tiles created!");
  });
}
