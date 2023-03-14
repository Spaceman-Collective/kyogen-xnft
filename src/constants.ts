/** Length of tile side */
export const TILE_LENGTH = 80;
/** Spacing between tiles */
export const TILE_SPACING = 4;
/** Length of feature within tile */
export const FEATURE_LENGTH = 72;
/** Since the feature sprite should be centered within the tile,
 * we will need to offset it and any other relative graphics. */
export const FEATURE_OFFSET = (TILE_LENGTH - FEATURE_LENGTH) / 2;
/** Length of unit within tile */
export const UNIT_LENGTH = 72;
/** Reduction factor of UNIT_LENGTH when on a structure. 0.8 means a 20% reduction  */
export const UNIT_ON_STRUCTURE_REDUCTION = 0.7;
/** Since the unit sprite should be centered within the tile,
 * we will need to offset it and any other relative graphics. */
export const UNIT_OFFSET = (TILE_LENGTH - UNIT_LENGTH) / 2;
/** Width of card */
export const CARD_WIDTH = 100;
/** Height of card */
export const CARD_HEIGHT = 100;
/** Viewport enforced boundaries */
export const WORLD_OVERFLOW = 200;

/** The local storage  key for game id */
export const LOCAL_GAME_KEY = "kyogen-gameId";

/** Player colors up to 32...for now */
export const playerColorPalette = [
  0xffffff, 0x0000ff, 0x42ff00, 0xffd700, 0xff6b00, 0xa020f0, 0x00ffff,
  0xff44e1,
  // additional randomlt generated colors
  0x23282b, 0xec7c26, 0x8a9597, 0x3d642d, 0xcac4b0, 0xcf3476, 0xff2301,
  0xc51d34, 0x8a9597, 0x252850, 0xc35831, 0xea899a, 0x721422, 0x6d3f5b,
  0xb44c43, 0x20603d, 0xbdecb6, 0xc2b078, 0x7e7b52, 0xa18594, 0x6a5f31,
  0x025669, 0xa65e2e, 0xfdf4e3,
];
