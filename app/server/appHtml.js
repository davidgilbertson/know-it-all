import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDomServer from 'react-dom/server';

import App from '../components/App.jsx';
import { isProd } from '../utils';
import {
  WEBPACK_BUNDLE,
} from '../constants.js';

import data from '../data/data';

let scriptSrc;

if (isProd) {
  const filePath = path.resolve(__dirname, `../../webpack/jsPackageName.json`);
  const jsPackageName = fs.readFileSync(filePath, `utf8`);
  scriptSrc = `/js/${JSON.parse(jsPackageName)}`;
} else {
  scriptSrc = `http://localhost:8081/${WEBPACK_BUNDLE}`;
}

console.time(`render`);
const appHtml = ReactDomServer.renderToString(<App data={data} />);
console.timeEnd(`render`);

const responseHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf8">
  <title>Know it all</title>
  <meta name="viewport" content="width=device-width, initial-scale=1 user-scalable=no">
  <link rel="stylesheet" href="/main.css" />
</head>
<body>
  <div id="app">${appHtml}</div>
  <script>
    window.APP_DATA=${JSON.stringify(data)};
  </script>
  <script async src="${scriptSrc}"></script>
</body>
</html>
`;

export default responseHtml;
