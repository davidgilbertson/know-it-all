module.exports = {
  env: {
    browser: true,
    node: true
  },
  extends: `airbnb`,
  rules: {
    quotes: [`error`, `backtick`],
    'no-console': [
      `warn`,
      {
        allow: [
          `info`,
          `time`,
          `timeEnd`,
          `warn`,
          `error`,
        ],
      },
    ],
    'react/prop-types': 0,
    'react/no-unknown-property': 0,
    'max-len': [`error`, 120]
  }
};
