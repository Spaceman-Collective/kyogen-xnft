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
  0xffa500, 0x00ff00, 0x1e90ff, 0xffd700, 0xff69b4, 0x40e0d0, 0xff6347,
  0x00ff7f, 0x4169e1, 0x6b8e23, 0xda70d6, 0x00ffff, 0xd3d3d3, 0xa9a9a9,
  0xe6e6fa, 0xffdab9, 0x87ceeb, 0x98fb98, 0xf5deb3, 0xfffff0, 0xfff8dc,
  0xffc0cb, 0xf4a460, 0xd2b48c, 0xadd8e6, 0xeee8aa, 0x2e8b57, 0xfa8072,
  0xba55d3, 0xe9967a, 0xf0e68c,
];

export const playerColorPaletteStr = [
  "#FFA500", // orange
  "#00FF00", // lime green
  "#1E90FF", // dodger blue
  "#FFD700", // gold
  "#FF69B4", // hot pink
  "#40E0D0", // turquoise
  "#FF6347", // tomato
  "#00FF7F", // spring green
  "#4169E1", // royal blue
  "#6B8E23", // olive drab
  "#DA70D6", // orchid
  "#00FFFF", // cyan
  "#D3D3D3", // light gray
  "#A9A9A9", // dark gray
  "#E6E6FA", // lavender
  "#FFDAB9", // peach puff
  "#87CEEB", // sky blue
  "#98FB98", // pale green
  "#F5DEB3", // wheat
  "#FFFFF0", // ivory
  "#FFF8DC", // corn silk
  "#FFC0CB", // pink
  "#F4A460", // sandy brown
  "#D2B48C", // tan
  "#ADD8E6", // light blue
  "#EEE8AA", // pale goldenrod
  "#2E8B57", // sea green
  "#FA8072", // salmon
  "#BA55D3", // medium orchid
  "#E9967A", // dark salmon
  "#F0E68C", // khaki
];
