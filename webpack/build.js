require(`babel-register`);
const crypto = require(`crypto`);
const fsExtra = require(`fs-extra`);
const path = require(`path`);
const webpack = require(`webpack`);
const swPrecache = require(`sw-precache`);
const htmlMinifier = require(`html-minifier`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);

const config = require(`./config.shared.js`);
const appHtml = require(`../app/server/appHtml`).default;
const decorateData = require(`../app/utils/decorateData`).default;

config.context = __dirname;

// in dev mode, only one package is produced
// in prod, an 'app' and an 'app-with-polyfills' is produced
config.entry = {
  app: [
    path.resolve(__dirname, `../app/client/client.jsx`),
  ],
  polyfills: [ // TODO (davidg): polyfills shouldn't share a hash can webpack do individual hashes?
    `babel-polyfill`,
    `whatwg-fetch`,
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

config.plugins.push(new ExtractTextPlugin(`styles.css`));

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

function removePublicDirectory() {
  return new Promise((resolve, reject) => {
    fsExtra.remove(`./public`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function copyAssetsToPublic() {
  return new Promise((resolve, reject) => {
    fsExtra.copy(`./assets`, `./public`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function generateServiceWorker() {
  return new Promise((resolve, reject) => {
    swPrecache.write(path.resolve(__dirname, `../public/service-worker.js`), {
      cacheId: `know-it-all`,
      filename: `service-worker.js`,
      stripPrefix: `public/`,
      staticFileGlobs: [
        `public/app.*.js`, // don't include the polyfills version
        `public/*.{html,ico,json,png}`,
      ],
      dontCacheBustUrlsMatching: [
        /\.(js|json)$/, // I'm cache busting js and json files myself
      ],
      skipWaiting: true,
    }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

function compileWithWebpack() {
  return new Promise((resolve, reject) => {
    const compiler = webpack(config);

    compiler.run((compileError, stats) => {
      if (compileError) {
        reject(compileError);
        return;
      }

      const jsonStats = stats.toJson({
        modules: false,
        chunks: false,
      });

      console.info(stats.toString({
        chunks: false,
        colors: true,
      }));

      // get the name of the JS file (including the hash webpack created)
      const scriptFileName = jsonStats.assetsByChunkName.app[0];

      // get the hash for the data file and copy it to public
      fsExtra.readFile(`./app/data/data.json`, `utf8`, (dataFileError, data) => {

        const json = JSON.parse(data);
        const itemList = decorateData(json);

        const fileContents = (
          `window.DATA = ${JSON.stringify(itemList)};`
        );

        const fileHash = crypto.createHash(`md5`).update(fileContents).digest(`hex`);
        const dataFileName = `data.${fileHash}.js`;

        // const dataHash = crypto.createHash(`md5`).update(dataJson).digest(`hex`);
        // const dataFileName = `data.${dataHash}.js`;

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
        fsExtra.writeFile(`./public/${dataFileName}`, fileContents, `utf8`, (dataJsonError) => {
          if (dataJsonError) {
            reject(`Error writing data.js to disk: ${dataJsonError}`);
            return;
          }

          dataFileWritten = true;
          if (indexFileWritten) resolve();
        });

        fsExtra.writeFile(`./public/index.html`, minHtmlString, `utf8`, (indexError) => {
          if (indexError) {
            reject(`Error creating index.html: ${indexError}`);
            return;
          }

          indexFileWritten = true;
          if (dataFileWritten) resolve();
        });
      });
    });
  });
}


console.time(`build`);

removePublicDirectory()
  .then(copyAssetsToPublic)
  .then(compileWithWebpack)
  .then(generateServiceWorker)
  .then(() => {
    console.timeEnd(`build`);
  })
  .catch((err) => {
    console.error(err);
  });
