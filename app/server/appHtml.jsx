/* eslint-disable max-len */
import fs from 'fs';
import path from 'path';
import { h } from 'preact'; /** @jsx h */
import preactRenderToString from 'preact-render-to-string';
import App from '../components/App/App';
import {
  WEBPACK_BUNDLE,
} from '../constants';

const data = require(`../data/data.json`);

export default ({ dataFileName = `data.json`, scriptFileName, mode }) => {
  let appScriptSrc;
  let polyfillScriptSrc = ``;
  let styleTag = ``;

  if (mode === `production`) {
    appScriptSrc = scriptFileName;
    polyfillScriptSrc = appScriptSrc.replace(`app.`, `polyfills.`);

    const stylesPath = path.resolve(__dirname, `../../public/styles.css`);
    const styles = fs.readFileSync(stylesPath, `utf8`);

    styleTag = `<style>${styles}</style>`;
  } else {
    appScriptSrc = `http://localhost:8081/${WEBPACK_BUNDLE}`;
  }

  const appHtml = preactRenderToString(<App data={data} version={process.env.npm_package_version} />);

  return `<!DOCTYPE html>
  <html>
    <head>
      <title>Know it all</title>
      
      <meta charset="utf8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <meta name="theme-color" content="#bf360c">
      <meta name="description" content="A big list of all the props, values, methods, functions, interfaces, modules, constants, constructors, events, attributes, parameters, return values, variables, elements, statements, operators, declarations, types, primatives, selectors and units of all the APIs related to web development.">

      <link rel="preload" href="${dataFileName}" />
      <link rel="preload" href="${appScriptSrc}" as="script" />

      <link rel="prefetch" href="${dataFileName}" />
      <link rel="prefetch" href="${appScriptSrc}" />

      <link rel="manifest" href="manifest.json">
      
      ${styleTag}
    </head>
    
    <body>
      ${appHtml}
      
      <script>
        (function() {
          window.APP_DATA = {
            dataFileName: '${dataFileName}',
            version: '${process.env.npm_package_version}',
          };
          
          var scripts = ['${appScriptSrc}'];
          
          var newBrowser = (
            'fetch' in window &&
            'Promise' in window &&
            'assign' in Object &&
            'keys' in Object
          );
          
          if (!newBrowser) {
            console.log('You need some polyfills, loading them now...');
            scripts.unshift('${polyfillScriptSrc}');
          }
          
          scripts.forEach(function(src) {
            var scriptEl = document.createElement('script');
            scriptEl.src = src;
            scriptEl.async = false;
            document.head.appendChild(scriptEl);
          });
        })();
      </script>
    </body>
  </html>
  `;
};

/* eslint-enable max-len */
