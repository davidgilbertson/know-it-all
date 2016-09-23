export const PORT = 8080;
export const DEV_PORT = 8081;
export const WEBPACK_BUNDLE = `webpack-bundle.js`;

export const COLORS = {
  GREY_LIGHT: `#f5f5f5`,
  GREEN: `#4caf50`,
  ORANGE: `#ff9800`,
  RED: `#f44336`,
};

export const TAGS = {
  C: { key: `C`, value: `Concept` },
  JP: { key: `JP`, value: `JS Primitive` },
  JF: { key: `JF`, value: `JS Function` },
  JM: { key: `JM`, value: `JS Primitive/Element Method` },
  DE: { key: `DE`, value: `DOM Element` },
  EA: { key: `EA`, value: `Element Attribute` },
  CP: { key: `CP`, value: `CSS Property` },
  CV: { key: `CV`, value: `CSS Value` },
  DT: { key: `DT`, value: `Data type` },
};

export const SCORES = {
  LEVEL_0: {
    key: 0,
    color: COLORS.GREY_LIGHT,
    icon: `--`,
    shortTitle: `Unrated`,
    value: `Unrated`,
  },
  LEVEL_1: {
    key: 1,
    color: COLORS.RED,
    icon: `¯\\_(ツ)_/¯`,
    shortTitle: `Don't know it`,
    value: `Never heard of it`,
  },
  LEVEL_2: {
    key: 2,
    color: COLORS.ORANGE,
    icon: `ʘ‿ʘ`,
    shortTitle: `Know of it`,
    value: `Heard of it, but I could know it better`,
  },
  LEVEL_3: {
    key: 3,
    color: COLORS.GREEN,
    icon: `(⌐■_■)`,
    shortTitle: `Know it`,
    value: `I know it like the back of my hand`,
  },
};

export const KEYS = {
  DOWN: 40,
  ENTER: 13,
  ESC: 27,
  SPACE: 32,
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  TOP_0: 48,
  TOP_1: 49,
  TOP_2: 50,
  TOP_3: 51,
  NUM_0: 96,
  NUM_1: 97,
  NUM_2: 98,
  NUM_3: 99,
};
