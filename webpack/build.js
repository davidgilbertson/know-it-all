require(`babel-register`);
const crypto = require(`crypto`);
const fs = require(`fs`);
const path = require(`path`);
const webpack = require(`webpack`);
const swPrecache = require(`sw-precache`);
const htmlMinifier = require(`html-minifier`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const rimraf = require(`rimraf`);

const config = require(`./config.shared.js`);
const appHtml = require(`../app/server/appHtml`).default;

console.time(`build`);

rimraf.sync(path.resolve(__dirname, `../public`));

fs.mkdirSync(`./public`);

fs.createReadStream(`./assets/favicon.ico`).pipe(fs.createWriteStream(`./public/favicon.ico`));

config.context = __dirname;
// in dev mode, only one package is produced
// in prod, an 'app' and an 'app-with-polyfills' is produced
config.entry = {
  app: [
    path.resolve(__dirname, `../app/client/client.js`),
  ],
  'app-with-polyfills': [
    `babel-polyfill`,
    `whatwg-fetch`,
    path.resolve(__dirname, `../app/client/client.js`),
  ],
};

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

function generateServiceWorker() {
  swPrecache.write(path.resolve(__dirname, `../public/service-worker.js`), {
    cacheId: `know-it-all`,
    filename: `service-worker.js`,
    stripPrefix: `public/`,
    staticFileGlobs: [
      `public/app.*.js`, // don't include the polyfills version
      `public/*.{html,ico,json}`,
    ],
    // skipWaiting: true,
    dontCacheBustUrlsMatching: [
      /\.(js|json)$/, // I'm cache busting js and json files myself
    ],
  });

  console.timeEnd(`build`);
}

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

  // get the hash for the data file and copy it to public
  fs.readFile(`./app/data/data.json`, `utf8`, (dataFileError, dataJson) => {
    const dataHash = crypto.createHash(`md5`).update(dataJson).digest(`hex`);
    const dataFileName = `data.${dataHash}.json`;

    // generate the html with the correct paths
    const htmlString = appHtml({
      dataFileName,
      scriptFileName,
      mode: `production`,
    });

    // This does pretty much nothing ATM (17.5kb -> 17.4kb)
    const minHtmlString = htmlMinifier.minify(htmlString, {
      caseSensitive: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
    });

    let dataFileWritten = false;
    let indexFileWritten = false;
    // write the data to a new file with the hash in the name
    // this could be a copy/rename but we already
    // had the file loaded and perf doesn't matter here
    // when they're both done, generate the service worker
    fs.writeFile(`./public/${dataFileName}`, dataJson, `utf8`, (dataJsonError) => {
      if (dataJsonError) console.error(`Error writing data.json to disk: ${dataJsonError}`);

      if (indexFileWritten) generateServiceWorker();
      dataFileWritten = true;
    });

    fs.writeFile(`./public/index.html`, minHtmlString, `utf8`, (indexError) => {
      if (indexError) console.error(`Error creating index.html: ${indexError}`);

      if (dataFileWritten) generateServiceWorker();
      indexFileWritten = true;
    });
  });
});
