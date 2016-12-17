import Inferno from 'inferno'; /** @jsx Inferno */
import App from '../components/App/App.jsx';

// We don't want to inline this data cos it's HUGE
// We fetch here, but we have already pre-fetched in the <head>
// So it's already at least partially ready
fetch(window.APP_DATA.dataFileName)
.then(response => response.json())
.then(data => {
  Inferno.render(<App data={data} version={window.APP_DATA.version} />, document.getElementById(`app`));
});

if (process.env.NODE_ENV === `production`) {
  // load service worker only in prod (doesn't play nice with HMR)
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`service-worker.js`)
      .catch((err) => {
        console.error(`Error registering service worker: ${err}`);
      });
  }
}
