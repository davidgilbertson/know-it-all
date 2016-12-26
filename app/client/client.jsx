import { h, render } from 'preact'; /** @jsx h */
import App from '../components/App/App';

// by the time this is run, data.js has run and put the data on window.DATA
render(<App data={window.DATA} version={window.APP_DATA.version} />, document.body, document.getElementById(`app`));

if (process.env.NODE_ENV === `production`) {
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`service-worker.js`)
      .catch((err) => {
        console.error(`Error registering service worker: ${err}`);
      });
  }
}
