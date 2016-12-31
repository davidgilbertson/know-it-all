require(`babel-register`);
const jsdom = require(`jsdom`);
const App = require(`./components/App/App`).default;

const dataMock = [
  {
    name: `CSS`,
    id: `1234`,
  },
  {
    name: `HTML`,
    id: `123443`,
  },
];

global.document = jsdom.jsdom();

const app = new App(dataMock, document.body);
const html = app.renderToString();
