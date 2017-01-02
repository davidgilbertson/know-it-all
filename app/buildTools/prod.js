import path from 'path';
import webpack from 'webpack';
import crypto from 'crypto';
import fsExtra from 'fs-extra';
import swPrecache from 'sw-precache';
import htmlMinifier from 'html-minifier';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import BabiliPlugin from 'babili-webpack-plugin';

import generateHtml from './../generateHtml';
import decorateData from '../utils/decorateData';
import {
  jsLoader,
  processPlugin,
} from './shared.config';

const config = {
  entry: {
    app: path.resolve(__dirname, `../client.js`),
    polyfills: [
      `babel-polyfill`,
      `whatwg-fetch`,
    ],
  },
  output: {
    path: path.resolve(__dirname, `../../public`),
    filename: `[name].[hash].js`,
  },
  module: {
    loaders: [
      jsLoader,
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract(`style`, `css!sass`), // I hate you so much webpack
      },
    ],
  },
  bail: true,
  plugins: [
    processPlugin,
    new BabiliPlugin({ comments: false }),
    new ExtractTextPlugin(`styles.css`),
  ],
};

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

function saveDataFiles() {
  let dataFileCount;
  let savedItemCount = 0;
  let mainModuleData;
  const fileNames = {
    main: ``,
    others: [],
  };

  return new Promise((resolve, reject) => {
    const saveModule = (fileName, fileContents, isMainFile) => {
      const fileHash = crypto.createHash(`md5`).update(fileContents).digest(`hex`);
      const hashedFileName = fileName.replace(`[hash]`, fileHash);
      if (isMainFile) {
        fileNames.main = hashedFileName;
      } else {
        fileNames.others.push(hashedFileName);
      }

      const moduleFilePath = path.resolve(__dirname, `../../public/${hashedFileName}`);
      fsExtra.writeFile(moduleFilePath, fileContents, `utf8`, (writeError) => {
        if (writeError) reject(`Error writing data.js:`, writeError);

        savedItemCount += 1;
        if (savedItemCount === dataFileCount) {
          resolve({
            itemList: mainModuleData,
            dataFileNames: fileNames,
          });
        }
      });
    };

    fsExtra.readFile(path.resolve(__dirname, `../data/data.json`), `utf8`, (readError, data) => {
      const fullItemTree = JSON.parse(data);

      dataFileCount = fullItemTree.length;

      const dataFiles = [];
      const firstModule = fullItemTree.shift();
      mainModuleData = decorateData([firstModule]);

      // this is only saved to be picked up in dev mode. Hence no hash
      // ATM is picked up by the service worker, should probably exclude it
      saveModule(`firstModule.json`, JSON.stringify(mainModuleData), true);

      fullItemTree.forEach((dataModule) => {
        // TODO (davidg): change decorateData rather than wrap in array here and above
        const itemList = decorateData([dataModule]);
        const fileName = `${dataModule.id}.[hash].json`;
        dataFiles.push(fileName);
        saveModule(fileName, JSON.stringify(itemList));
      });
    });
  });
}

function compileWithWebpack({ itemList, dataFileNames }) {
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

      // generate the html with the correct paths
      const htmlString = generateHtml({
        data: itemList,
        dataFileNames,
        mode: `production`,
        scriptFileName,
      });

      const minHtmlString = htmlMinifier.minify(htmlString, {
        caseSensitive: true,
        keepClosingSlash: true,
        minifyCSS: true,
        minifyJS: true,
      });

      const indexFilePath = path.resolve(__dirname, `../../public/index.html`);
      fsExtra.writeFile(indexFilePath, minHtmlString, `utf8`, (indexError) => {
        if (indexError) {
          reject(`Error creating index.html: ${indexError}`);
          return;
        }
        resolve();
      });

      const dataJsonFilePath = path.resolve(__dirname, `../data/dataFileNames.json`);
      fsExtra.writeFile(dataJsonFilePath, JSON.stringify(dataFileNames), `utf8`, (dataFileError) => {
        if (dataFileError) console.error(dataFileError);
      });
    });
  });
}

function generateServiceWorker() {
  return new Promise((resolve, reject) => {
    swPrecache.write(path.resolve(__dirname, `../../public/service-worker.js`), {
      cacheId: `know-it-all`,
      filename: `service-worker.js`,
      stripPrefix: `public/`,
      staticFileGlobs: [
        `public/app.*.js`, // don't include the polyfills
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

console.time(`build`);

removePublicDirectory()
.then(copyAssetsToPublic)
.then(saveDataFiles)
.then(compileWithWebpack)
.then(generateServiceWorker)
.then(() => {
  console.timeEnd(`build`);
})
.catch((err) => {
  console.error(err);
});
