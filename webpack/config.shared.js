const webpack = require(`webpack`);
const path = require(`path`);

process.env.WEBPACKING = true;

module.exports = {
  entry: [
    `./app/client/client.js`,
  ],
  output: {
    path: path.resolve(__dirname, `../static`),
    filename: `app.[hash].js`,
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
    //   /localforage/,
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
