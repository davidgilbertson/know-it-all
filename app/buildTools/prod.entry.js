process.env.NODE_ENV = process.env.NODE_ENV || `production`;

const jsdom = require(`jsdom`);

global.document = jsdom.jsdom();
global.window = document.defaultView;

window.APP_META = { BROWSER: false };

require(`babel-register`);
require(`./prod`);
