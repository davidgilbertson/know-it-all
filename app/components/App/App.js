import Row from '../Row/Row';
import ScoreBar from '../ScoreBar/ScoreBar';
import TwitterShareButton from '../TwitterShareButton/TwitterShareButton';
import InfoModal from '../InfoModal/InfoModal';
import store from '../../data/store';
import {
  a,
  button,
  div,
  h1,
  header,
  svg,
  path,
} from '../../utils/elements';

import { EVENTS } from '../../utils/constants';
import swapNodes from '../../utils/swapNodes';

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
      button(
        {
          className: `app__hamburger`,
          onclick: () => {
            store.showModal();
          },
        },
        svg({ width: 30, height: 30, viewBox: `0 0 21 21` },
          path({ d: `M0 3 h21 v3 h-21 v-3 M0 9 h21 v3 h-21 v-3 M0 15 h21 v3 h-21 v-3` }),
        ),
      ),

      h1(
        {
          className: `app__header-title`,
          title: `Know It All, version ${props.version}`,
        },
        `Know It All`
      ),

      div({ className: `app__tweet` },
        TwitterShareButton(),
      ),
    ),
    table,

    ScoreBar(),

    InfoModal(),
  );
};

export default App;
