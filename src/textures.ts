import * as PIXI from "pixi.js";
import AncientSpawn from "../public/building_spawn_ancients.webp";
import CreeperSpawn from "../public/building_spawn_creepers.webp";
import SynthSpawn from "../public/building_spawn_synths.webp";
import WildingSpawn from "../public/building_spawn_wildlings.webp";
import AncientNinja from "../public/ancient_ninja.webp";
import CreeperNinja from "../public/creeper_ninja.webp";
import SynthNinja from "../public/synth_ninja.webp";
import WildingNinja from "../public/wildling_ninja.webp";
import AncientSohei from "../public/ancient_sohei.webp";
import CreeperSohei from "../public/creeper_sohei.webp";
import SynthSohei from "../public/synth_sohei.webp";
import WildingSohei from "../public/wildling_sohei.webp";
import AncientSamurai from "../public/ancient_samurai.webp";
import CreeperSamurai from "../public/creeper_samurai.webp";
import SynthSamurai from "../public/synth_samurai.webp";
import WildingSamurai from "../public/wildling_samurai.webp";

import Meteor from "../public/building_solarite.webp";

// PERF maybe we want to lazy load these

export const AncientNinjaTexture = PIXI.Texture.from(AncientNinja.src);
export const CreeperNinjaTexture = PIXI.Texture.from(CreeperNinja.src);
export const SynthNinjaTexture = PIXI.Texture.from(SynthNinja.src);
export const WildingNinjaTexture = PIXI.Texture.from(WildingNinja.src);

export const AncientSoheiTexture = PIXI.Texture.from(AncientSohei.src);
export const CreeperSoheiTexture = PIXI.Texture.from(CreeperSohei.src);
export const SynthSoheiTexture = PIXI.Texture.from(SynthSohei.src);
export const WildingSoheiTexture = PIXI.Texture.from(WildingSohei.src);

export const AncientSamuraiTexture = PIXI.Texture.from(AncientSamurai.src);
export const CreeperSamuraiTexture = PIXI.Texture.from(CreeperSamurai.src);
export const SynthSamuraiTexture = PIXI.Texture.from(SynthSamurai.src);
export const WildingSamuraiTexture = PIXI.Texture.from(WildingSamurai.src);

export const CreeperSpawnTexture = PIXI.Texture.from(CreeperSpawn.src);
export const AncientSpawnTexture = PIXI.Texture.from(AncientSpawn.src);
export const SynthSpawnTexture = PIXI.Texture.from(SynthSpawn.src);
export const WildingSpawnTexture = PIXI.Texture.from(WildingSpawn.src);

export const MeteorTexture = PIXI.Texture.from(Meteor.src);
