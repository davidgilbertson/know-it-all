import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDomServer from 'react-dom/server';

import App from '../components/App/App.jsx';
import {
  WEBPACK_BUNDLE,
} from '../constants.js';

const data = require(`../data/data.json`);

export default ({ dataFileName = `data.json`, scriptFileName, mode }) => {
  let scriptSrc;
  let styleTag = ``;

  if (mode === `production`) {
    scriptSrc = scriptFileName;

    const stylesPath = path.resolve(__dirname, `../../static/styles.css`);
    const styles = fs.readFileSync(stylesPath, `utf8`);

    styleTag = `<style>${styles}</style>`;
  } else {
    scriptSrc = `http://localhost:8081/${WEBPACK_BUNDLE}`;
  }

  const appHtml = ReactDomServer.renderToString(<App data={data} />);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf8">
    <title>Know it all</title>
    <meta name="viewport" content="width=device-width, initial-scale=1 user-scalable=no">
    ${styleTag}
    <link rel="prefetch" href="${dataFileName}" />
    <script>
      window.APP_DATA = {
        dataFileName: '${dataFileName}',
      };
    </script>
  </head>
  <body>
    <div id="app">${appHtml}</div>
    <script async src="${scriptSrc}"></script>
  </body>
  </html>
  `;
};
