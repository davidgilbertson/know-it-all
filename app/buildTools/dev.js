import path from 'path';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import express from 'express';

window.APP_META = { BROWSER: false };

import generateHtml from './../generateHtml';

import {
  jsLoader,
  sassLoader,
  processPlugin,
  hotPlugin,
} from './shared.config';
import {
  DEV_PORT,
  PORT,
} from '../utils/constants';

const dataFileNames = require(`../data/dataFileNames.json`);
const data = require(`../../public/firstModule.json`);

const contentBase = `http://localhost:${DEV_PORT}`;

const config = {
  entry: [
    `webpack-dev-server/client?${contentBase}`,
    `webpack/hot/only-dev-server`,
    `./app/client.js`,
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
    noParse: /localforage/,
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

devServer.listen(DEV_PORT, (err) => {
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

app.listen(PORT, (err) => {
  if (err) console.error(`Error starting server:`, err);
  console.info(`Server listening on port`, PORT);
});
