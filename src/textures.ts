import * as PIXI from "pixi.js";
import AncientSpawn from "../public/building_spawn_ancients.webp";
import CreeperSpawn from "../public/building_spawn_creepers.webp";
import SynthSpawn from "../public/building_spawn_synths.webp";
import WildlingSpawn from "../public/building_spawn_wildlings.webp";
import CreeperNinja from "../public/tile_creeper_ninja_2x.webp";
import CreeperSohei from "../public/tile_creeper_sohei_2x.webp";
import CreeperSamurai from "../public/tile_creeper_samurai_2x.webp";

// PERF maybe we want to lazy load these
export const CreeperSpawnTexture = PIXI.Texture.from(CreeperSpawn.src);
export const CreeperNinjaTexture = PIXI.Texture.from(CreeperNinja.src);
export const CreeperSoheiTexture = PIXI.Texture.from(CreeperSohei.src);
export const CreeperSamuraiTexture = PIXI.Texture.from(CreeperSamurai.src);

export const AncientSpawnTexture = PIXI.Texture.from(AncientSpawn.src)
export const SynthSpawnTexture = PIXI.Texture.from(SynthSpawn.src)
export const WildlingSpawnTexture = PIXI.Texture.from(WildlingSpawn.src)
