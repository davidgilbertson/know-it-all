import Row from '../Row/Row';
import ScoreBar from '../ScoreBar/ScoreBar';
import store from '../../data/store';
import {
  a,
  div,
  h1,
  header,
} from '../../utils/elements';

import { EVENTS } from '../../utils/constants';

if (process.env.IMPORT_SCSS) require(`./App.scss`); // eslint-disable-line global-require

const App = (props) => {
  const topChildren = store.getChildrenOf();

  let rows;
  if (topChildren) {
    rows = topChildren.map(item => Row(item));
  } else {
    console.warn(`Something has gone wrong, there are no top-level items.`);
  }

  const table = div({ className: `app__table` }, rows);

  store.listen(EVENTS.MODULES_ADDED, (newTopChildren) => {
    newTopChildren.forEach((child) => {
      table.appendChild(Row(child));
    });
  });

  if (window.APP_META.BROWSER) {
    setTimeout(() => {
      const otherModules = window.APP_META.otherModuleFileNames;
      if (otherModules && otherModules.length) {
        const fetchPromises = otherModules.map(fileName => (
          fetch(fileName).then(response => response.json())
        ));

        Promise.all(fetchPromises).then((data) => {
          store.addModules(data);
        });
      }
    }, 100);
  }

  return div({ id: `app` },
    header({ className: `app__header` },
      h1({ className: `app__header-title` }, `Know It All`),
      a(
        {
          className: `app__header-help`,
          target: `_blank`,
          rel: `noopener noreferrer`,
          title: `Find out more about know it all, version ${props.version}`,
          href: `https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64`,
        },
        `What is this?`,
      ),
    ),
    table,

    ScoreBar(),
  );
};

export default App;
