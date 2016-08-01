const path = require('path');

module.exports = {
  entry: [
    './app/client/client.js',
  ],
  output: {
    path: path.resolve(__dirname, '../static/js'),
    filename: 'client.[hash].js',
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      },
    ],
  },
  bail: true,
  plugins: [], // extended in prod/dev-specific configs
};
