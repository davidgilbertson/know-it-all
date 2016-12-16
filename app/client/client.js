import { h, render } from 'preact'; /** @jsx h */
import App from '../components/App/App.jsx';

// We don't want to inline this data cos it's HUGE
// We fetch here, but we have already pre-fetched in the <head>
// So it's already at least partially ready
fetch(window.APP_DATA.dataFileName)
.then(response => response.json())
.then(data => {
  render(<App data={data} version={window.APP_DATA.version} />, document.body, document.getElementById(`app`));
});

// from: https://github.com/developit/preact-boilerplate/blob/37f9b40ec8d7d1331cf1a37d7b70484a3e86fc4e/src/index.js
// let root;
// function init() {
//   let App = require('./components/App/App.jsx').default;
//   root = render(<App />, document.body, root);
// }
//
// init();
//
// if (module.hot) {
//   module.hot.accept('./components/App/App.jsx', () => requestAnimationFrame( () => {
//     flushLogs();
//     init();
//   }) );
//
//   // optional: mute HMR/WDS logs
//   let log = console.log,
//     logs = [];
//   console.log = (t, ...args) => {
//     if (typeof t==='string' && t.match(/^\[(HMR|WDS)\]/)) {
//       if (t.match(/(up to date|err)/i)) logs.push(t.replace(/^.*?\]\s*/m,''), ...args);
//     }
//     else {
//       log.call(console, t, ...args);
//     }
//   };
//   let flushLogs = () => console.log(`%c🚀 ${logs.splice(0,logs.length).join(' ')}`, 'color:#888;');
// }

if (process.env.NODE_ENV === `production`) {
  // load service worker only in prod (doesn't play nice with HMR)
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`service-worker.js`)
      .catch((err) => {
        console.error(`Error registering service worker: ${err}`);
      });
  }
}
