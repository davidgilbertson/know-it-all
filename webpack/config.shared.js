const path = require(`path`);

module.exports = {
  entry: [
    `./app/client/client.js`,
  ],
  output: {
    path: path.resolve(__dirname, `../static/js`),
    filename: `client.[hash].js`,
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
  //   alias: {
  //     localforage$: `localforage/dist/localforage.nopromises.min.js`,
  //   },
  },
  bail: true,
  plugins: [], // extended in prod/dev-specific configs
};
