require('babel-register');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const config = require('./config.shared.js');

const rimraf = require('rimraf');

rimraf.sync(path.resolve(__dirname, '../static/js'));

config.entry.unshift('babel-polyfill');

config.plugins = config.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: false,
  }),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
    },
  }),
]);

config.module.loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    compact: true,
  },
});

const compiler = webpack(config);

compiler.run((err, stats) => {
  if (err) console.error(err);

  const jsPackageName = stats.toJson().assetsByChunkName.main;

  const fileName = path.resolve(__dirname, './jsPackageName.json');
  fs.writeFile(fileName, JSON.stringify(jsPackageName), 'utf8');
});
