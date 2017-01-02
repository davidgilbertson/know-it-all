const webpack = require(`webpack`);

export const jsLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  loader: `babel`,
  query: {
    compact: true, // TODO (davidg): why?
  },
};

export const sassLoader = {
  test: /\.scss$/,
  exclude: /node_modules/,
  loaders: [
    `style`,
    `css`,
    `sass`,
  ],
};

export const uglify = new webpack.optimize.UglifyJsPlugin({ sourceMap: true });
export const dedupe = new webpack.optimize.DedupePlugin();

export const processPlugin = new webpack.DefinePlugin({
  'process.env': {
    IMPORT_SCSS: JSON.stringify(true),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  },
});

export const hotPlugin = new webpack.HotModuleReplacementPlugin();
