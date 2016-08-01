require('babel-register');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./config.shared.js');
const CONSTANTS = require('../app/constants.js');

const contentBase = `http://localhost:${CONSTANTS.DEV_PORT}`;

config.entry.unshift(
  `webpack-dev-server/client?${contentBase}`,
  'webpack/hot/only-dev-server'
);

config.module.loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loaders: [
    'react-hot',
    'babel',
  ],
});

config.output.publicPath = `${contentBase}/`;
config.output.filename = CONSTANTS.WEBPACK_BUNDLE;

config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler = webpack(config);

const devConfig = {
  hot: true,
  noInfo: true,
};

const devServer = new WebpackDevServer(compiler, devConfig);

devServer.listen(CONSTANTS.DEV_PORT);
