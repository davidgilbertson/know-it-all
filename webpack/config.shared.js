const webpack = require(`webpack`);
const path = require(`path`);

module.exports = {
  entry: {
    app: [
      `./app/client/client.js`,
    ],
    'app-with-polyfills': [
      `babel-polyfill`,
      `./app/client/client.js`,
    ],
  },
  output: {
    path: path.resolve(__dirname, `../public`),
    filename: `[name].[hash].js`,
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: `json`,
        exclude: /node_modules/,
      },
    ],
    // noParse: [
      // /localforage/,
    // ],
  },
  resolve: {
    extensions: [``, `.js`, `.jsx`],
  },
  bail: true,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        IMPORT_SCSS: JSON.stringify(true),
      },
    }),
  ],
};
