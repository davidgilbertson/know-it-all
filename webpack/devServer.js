require(`babel-register`);
const webpack = require(`webpack`);
const WebpackDevServer = require(`webpack-dev-server`);
const config = require(`./config.shared.js`);
const CONSTANTS = require(`../app/constants.js`);

const contentBase = `http://localhost:${CONSTANTS.DEV_PORT}`;

// in dev mode, only one package is produced
// in prod, an 'app' and an 'app-with-polyfills' is produced
config.entry = [
  `webpack-dev-server/client?${contentBase}`,
  `webpack/hot/only-dev-server`,
  `./app/client/client.js`,
];

config.devtool = `source-map`; // I love you webpack

config.module.loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loaders: [
    `react-hot`,
    `babel`,
  ],
});

config.module.loaders.push({
  test: /\.scss$/,
  exclude: /node_modules/,
  loaders: [
    `style`,
    `css`,
    `sass`,
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
