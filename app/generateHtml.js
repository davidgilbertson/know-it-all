/* eslint-disable max-len */
const fs = require(`fs`);
const path = require(`path`);
const jsdom = require(`jsdom`);
const App = require(`./components/App/App`).default;
const store = require(`./data/store`).default;

export default ({ scriptFileName, mode, data, dataFileNames }) => {
  store.init(data);

  const version = process.env.npm_package_version;
  let polyfillScriptSrc = ``;
  let styleTag = ``;

  console.time(`render-app`);
  const app = App({ version });
  console.timeEnd(`render-app`);

  if (mode === `production`) {
    polyfillScriptSrc = scriptFileName.replace(`app.`, `polyfills.`);

    const stylesPath = path.resolve(__dirname, `../public/styles.css`);
    const styles = fs.readFileSync(stylesPath, `utf8`);

    styleTag = `<style>${styles}</style>`;
  }

  return `<!DOCTYPE html>
  <html>
    <head>
      <title>Know it all</title>

      <meta charset="utf8">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <meta name="theme-color" content="#bf360c">
      <meta name="description" content="A big list of all the props, values, methods, functions, interfaces, modules, constants, constructors, events, attributes, parameters, return values, variables, elements, statements, operators, declarations, types, primatives, selectors and units of all the APIs related to web development.">

      <link rel="preload" href="${scriptFileName}" as="script" />

      <link rel="manifest" href="manifest.json">

      ${styleTag}
    </head>

    <body>
      ${app.outerHTML}

      <script>
        (function() {
          window.APP_META = {
            data: ${JSON.stringify(data)},
            version: '${version}',
            otherModuleFileNames: ${JSON.stringify(dataFileNames.others)},
          };

          var scripts = [
            '${scriptFileName}'
          ];

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

        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      
        ga('create', 'UA-89696437-1', 'auto');
        ga('send', 'pageview');
      </script>
    </body>
  </html>
  `;
};

/* eslint-enable max-len */
