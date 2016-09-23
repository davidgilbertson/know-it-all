/* eslint-disable global-require */

export const isProd = process.env.NODE_ENV === `production`;
export const decorateData = require(`./decorateData.js`).decorateData;

/* eslint-enable global-require */
