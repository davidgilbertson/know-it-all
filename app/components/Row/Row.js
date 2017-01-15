import store from '../../data/store';
import Tags from '../Tags/Tags';
import ScoreButtons from '../ScoreButtons/ScoreButtons';
import PieChart from '../PieChart/PieChart';
import swapNodes from '../../utils/swapNodes';

import {
  button,
  div,
  p,
  span,
} from '../../utils/elements';

import {
  TAGS,
} from '../../utils/constants';

if (process.env.IMPORT_SCSS) require(`./Row.scss`); // eslint-disable-line global-require

const expandOrCollapseRow = (e, item) => {
  e.stopPropagation();

  if (item.expanded) {
    store.collapseItemById(item.id);
  } else {
    store.expandItemById(item.id);
  }
};

const Row = (initialProps) => {
  let el = null;
  const itemId = initialProps.id;

  const render = () => {
    // for every render, get the latest data from the store
    const item = store.getItem(itemId);

    const childRows = !item.leaf && item.expanded
      ? div(store.getChildrenOf(item.id).map(child => Row(child)))
      : null;

    const isNotCode = !!(item.tags || []).find(tagKey => (
      tagKey === TAGS.ROOT.key ||
      tagKey === TAGS.GROUPING.key ||
      tagKey === TAGS.INFO.key
    ));

    const rowNameStyle = !isNotCode
      ? { fontFamily: `"Courier New", monospace` }
      : null;

    const notes = item.notes;
    const notesText = notes
      ? span({ className: `row__notes` },
        item.notes,
      )
      : null;

    let className = `row`;
    if (item.selected) className += ` row--selected`;
    if (item.expanded) className += ` row--expanded`;

    let buttonContent;
    let buttonDisabled = false;

    if (item.leaf) {
      buttonContent = `○`;
      buttonDisabled = true;
    } else {
      buttonContent = `▼`;
    }

    return div({ className },
      div(
        {
          className: `row__content`,
          onclick: () => store.selectItemById(item.id),
        },
        button(
          {
            onclick: e => expandOrCollapseRow(e, item),
            className: `row__triangle`,
            disabled: buttonDisabled,
          },
          buttonContent,
        ),

        div({ className: `row__words` },
          p({ className: `row__name` },
            span({ style: rowNameStyle },
              item.name,
            ),
            notesText,
          ),
        ),

        Tags(item.tags),

        ScoreButtons({ item }),

        PieChart(item),
      ),
      childRows,
    );
  };

  store.listen(itemId, () => {
    el = swapNodes(el, render());
  });

  el = render();

  return el;
};

export default Row;
