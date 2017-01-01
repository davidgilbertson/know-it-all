import store from '../../store';

import Tags from '../Tags/Tags';
import ScoreButtons from '../ScoreButtons/ScoreButtons';

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

if (process.env.IMPORT_SCSS) require(`./TableRow.scss`); // eslint-disable-line global-require

const expandOrCollapseRow = (e, item) => {
  e.stopPropagation();

  if (item.expanded) {
    store.collapseItemById(item.id);
  } else {
    store.expandItemById(item.id);
  }
};

// const selectRow = (item) => {
//   store.selectItemById(item.id);
// };

const TableRow = (initialProps) => {
  let el = null;

  const render = (props) => {
    const childRows = !props.leaf && props.expanded
      ? div(store.getChildrenOf(props.id).map(child => TableRow(child)))
      : null;

    const isNotCode = !!(props.tags || []).find(tagKey => (
      tagKey === TAGS.ROOT.key ||
      tagKey === TAGS.GROUPING.key ||
      tagKey === TAGS.INFO.key
    ));

    const tableRowNameStyle = !isNotCode
      ? { fontFamily: `"Courier New", monospace` }
      : null;

    const notes = props.notes;
    const notesText = notes
      ? span({ className: `table-row__notes` },
        props.notes,
      )
      : null;

    let className = `table-row`;
    if (props.selected) className += ` table-row--selected`;

    let buttonContent;
    let buttonDisabled = false;

    if (props.leaf) {
      buttonContent = `●`;
      buttonDisabled = true;
    } else if (props.expanded) {
      buttonContent = `▼`;
    } else {
      buttonContent = `▶`;
    }

    return div({ className },
      div(
        {
          className: `table-row__content`,
          onclick: () => store.selectItemById(props.id),
        },
        button(
          {
            onclick: e => expandOrCollapseRow(e, props),
            className: `table-row__triangle`,
            disabled: buttonDisabled,
          },
          buttonContent,
        ),

        div({ className: `table-row__words` },
          p({ className: `table-row__name` },
            span({ style: tableRowNameStyle },
              props.name,
            ),
            notesText,
          ),
        ),

        Tags(props.tags),

        ScoreButtons(props),
      ),
      childRows,
    );
  };

  const update = (prevEl, newData) => {
    const nextEl = render(newData);

    if (nextEl.isEqualNode(prevEl)) {
      console.warn(`render() was called but there was no change in the rendered output`, el);
    } else {
      swapNodes(prevEl, nextEl); // replace the existing element with the new one
    }

    return nextEl;
  };

  el = render(initialProps);

  store.listen(initialProps.id, (newData) => {
    el = update(el, newData);
  });

  return el;
};

export default TableRow;
