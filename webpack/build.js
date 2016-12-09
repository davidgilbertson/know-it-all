require(`babel-register`);
const crypto = require(`crypto`);
const fs = require(`fs`);
const path = require(`path`);
const webpack = require(`webpack`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const config = require(`./config.shared.js`);

const appHtml = require(`../app/server/appHtml`).default;

const rimraf = require(`rimraf`);

rimraf.sync(path.resolve(__dirname, `../public`));

fs.mkdirSync(`./public`);

fs.createReadStream(`./assets/favicon.ico`).pipe(fs.createWriteStream(`./public/favicon.ico`));

config.plugins = config.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(`production`),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  new webpack.optimize.DedupePlugin(),
]);

config.plugins.push(
  new ExtractTextPlugin(`styles.css`)
);

config.module.loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loader: `babel`,
  query: {
    compact: true,
  },
});

config.module.loaders.push({
  test: /\.scss$/,
  exclude: /node_modules/,
  loader: ExtractTextPlugin.extract(`style`, `css!sass`), // I hate you so much webpack
});

const compiler = webpack(config);

compiler.run((compileError, stats) => {
  if (compileError) {
    console.error(compileError);
    return;
  }

  const jsonStats = stats.toJson({
    modules: false,
    chunks: false,
  });

  console.log(stats.toString({
    chunks: false,
    colors: true,
  }));

  // get the name of the JS file (including the hash webpack created)
  const scriptFileName = jsonStats.assetsByChunkName.app[0];
  const polyfilledScriptFileName = jsonStats.assetsByChunkName[`app-with-polyfills`][0];

  // get the hash for the data file and copy it to public
  fs.readFile(`./app/data/data.json`, `utf8`, (dataFileError, dataJson) => {
    const dataHash = crypto.createHash(`md5`).update(dataJson).digest(`hex`);
    const dataFileName = `data.${dataHash}.json`;

    // generate the html with the correct paths
    const htmlString = appHtml({
      dataFileName,
      scriptFileName,
      polyfilledScriptFileName,
      mode: `production`,
    });

    // write the data to a new file with the hash in the name
    // this could be a copy/rename but we already
    // had the file loaded and perf doesn't matter here
    fs.writeFile(`./public/${dataFileName}`, dataJson, `utf8`, (dataJsonError) => {
      if (dataJsonError) console.error(`Error writing data.json to disk: ${dataJsonError}`);
    });

    fs.writeFile(`./public/index.html`, htmlString, `utf8`, (indexError) => {
      if (indexError) console.error(`Error creating index.html: ${indexError}`);

      console.timeEnd(`build`);
    });
  });
});

console.time(`build`);
