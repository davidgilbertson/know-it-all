const webpack = require(`webpack`);
const path = require(`path`);

module.exports = {
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
    // alias: {
    //   react: `preact-compat`,
    //   'react-dom': `preact-compat`,
    // },
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
