import App from './components/App/App';
import store from './data/store';
import swapNodes from './utils/swapNodes';
import {
  KEYS,
  SCORES,
} from './utils/constants';

window.APP_META.BROWSER = true;

store.init(window.APP_META.data);

const app = App({ version: window.APP_META.version });

const serverAppEl = document.getElementById(`app`);

// check that the server and client markup match, then switch them out
if (app.isEqualNode(serverAppEl)) {
  swapNodes(serverAppEl, app);
} else {
  console.error(`The client markup did not match the server markup`);

  console.info(`server:`, serverAppEl.outerHTML);
  console.info(`client:`, app.outerHTML);
}

window.addEventListener(`keydown`, (e) => {
  if (e.keyCode === KEYS.DOWN) {
    store.selectNextVisibleRow();
  } else if (e.keyCode === KEYS.UP) {
    store.selectPrevVisibleRow();
  } else if (e.keyCode === KEYS.RIGHT) {
    store.expandSelectedItem();
  } else if (e.keyCode === KEYS.LEFT) {
    store.collapseSelectedItem();
  } else if (e.keyCode === KEYS.TOP_0 || e.keyCode === KEYS.NUM_0) {
    store.scoreSelectedItem(SCORES.LEVEL_0.key);
  } else if (e.keyCode === KEYS.TOP_1 || e.keyCode === KEYS.NUM_1) {
    store.scoreSelectedItem(SCORES.LEVEL_1.key);
  } else if (e.keyCode === KEYS.TOP_2 || e.keyCode === KEYS.NUM_2) {
    store.scoreSelectedItem(SCORES.LEVEL_2.key);
  } else if (e.keyCode === KEYS.TOP_3 || e.keyCode === KEYS.NUM_3) {
    store.scoreSelectedItem(SCORES.LEVEL_3.key);
  } else if (e.keyCode === KEYS.TOP_4 || e.keyCode === KEYS.NUM_4) {
    store.scoreSelectedItem(SCORES.LEVEL_4.key);
  }
});

if (process.env.NODE_ENV === `production`) {
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`service-worker.js`)
    .catch((err) => {
      console.error(`Error registering service worker: ${err}`);
    });
  }
}
