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
  swapNodes(serverAppEl, app, true);
} else {
  console.error(`The client markup did not match the server markup`);

  console.info(`server:`, serverAppEl.outerHTML);
  console.info(`client:`, app.outerHTML);
}

//  --  SORRY, BELOW IS A BIT OF A MISCELLANEOUS MESS  --  //
// TODO (davidg): performance tests for splitting this out into modules (there's a webpack overhead per module)

// row height doesn't change at different screen sizes, so it's enough to get it once
const rowHeight = document.querySelector('.row__content').offsetHeight;
function scrollPageOneRow(dir = 1) {
  window.scrollBy(0, rowHeight * dir);
}

//  --  BIND CLICK EVENTS  --  //
window.addEventListener(`keydown`, (e) => {
  e.preventDefault(); // block the page from scrolling

  if (e.keyCode === KEYS.DOWN) {
    store.selectNextVisibleRow();
    scrollPageOneRow(1);
  } else if (e.keyCode === KEYS.UP) {
    scrollPageOneRow(-1);
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

//  --  LOAD THE TWITTER WIDGET  --  //
/* eslint-disable */
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
/* eslint-enable */

//  --  GET THE SERVICE WORKER SCRIPT  --  //
if (process.env.NODE_ENV === `production`) {
  if (`serviceWorker` in navigator) {
    navigator.serviceWorker.register(`service-worker.js`)
    .catch((err) => {
      console.error(`Error registering service worker: ${err}`);
    });
  }
}
