import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDomServer from 'react-dom/server';

import App from '../components/App.jsx';
import { isProd } from '../utils';
import {
  WEBPACK_BUNDLE,
} from '../constants';

let scriptSrc;

if (isProd) {
  const filePath = path.resolve(__dirname, '../../webpack/jsPackageName.json');
  const jsPackageName = fs.readFileSync(filePath, 'utf8');
  scriptSrc = `/js/${JSON.parse(jsPackageName)}`;
} else {
  scriptSrc = `http://localhost:8081/${WEBPACK_BUNDLE}`;
}

const appHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Know it all</title>
</head>
<body>
  <div id="app">${ReactDomServer.renderToString(<App />)}</div>
  <script async src="${scriptSrc}"></script>
</body>
</html>
`;

export default appHtml;
