import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App/App.jsx';

// We don't want to inline this data cos it's HUGE
// We fetch here, but we have already pre-fetched in the <head>
// So it's already at least partially ready
fetch(window.APP_DATA.dataFileName)
.then(response => response.json())
.then(data => {
  ReactDOM.render(<App data={data} />, document.getElementById(`app`));
});

if (process.env.NODE_ENV !== `production`) {
  // Load Perf tools only in dev
  window.Perf = require(`react-addons-perf`); // eslint-disable-line global-require
} else {
  // load service worker only in prod (doesn't play nice with HMR)
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`service-worker.js`);
  }
}
