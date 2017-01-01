require(`babel-register`);
const fs = require(`fs`);
const path = require(`path`);
const webpack = require(`webpack`);
const WebpackDevServer = require(`webpack-dev-server`);
const express = require(`express`);
const generateHtml = require(`./../generateHtml`).default;
const jsLoader = require(`./shared.config`).jsLoader;
const sassLoader = require(`./shared.config`).sassLoader;
const processPlugin = require(`./shared.config`).processPlugin;
const hotPlugin = require(`./shared.config`).hotPlugin;
const CONSTANTS = require(`../utils/constants.js`);
const dataFileNames = require(`../data/dataFileNames.json`);
const data = require(`../../public/firstModule.json`);

process.env.NODE_ENV = process.env.NODE_ENV || `development`;

const contentBase = `http://localhost:${CONSTANTS.DEV_PORT}`;

const config = {
  entry: [
    `webpack-dev-server/client?${contentBase}`,
    `webpack/hot/only-dev-server`,
    `./ff/client.js`,
  ],
  output: {
    path: path.resolve(__dirname, `./public`),
    publicPath: `${contentBase}/`,
    filename: `bundle.js`,
  },
  module: {
    loaders: [
      jsLoader,
      sassLoader,
    ],
  },
  bail: true,
  plugins: [hotPlugin, processPlugin],
  devtool: `source-map`,
};

// set up the webpack server
const compiler = webpack(config);

const devConfig = {
  hot: true,
  noInfo: true,
};

const devServer = new WebpackDevServer(compiler, devConfig);

devServer.listen(CONSTANTS.DEV_PORT, (err) => {
  if (err) console.error(`Error starting the dev server: ${err}`);
});

// start the express server
const app = express();

const html = generateHtml({
  data,
  dataFileNames,
  mode: `dev`,
  scriptFileName: `${contentBase}/bundle.js`,
});

app.get(`/`, (req, res) => {
  res.send(html);
});

app.use(express.static(`public`));

app.listen(CONSTANTS.PORT, (err) => {
  if (err) console.error(`Error starting server:`, err);
  console.info(`Server listening on port`, CONSTANTS.PORT);
});
