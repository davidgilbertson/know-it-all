import store from '../../data/store';
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

  const render = (props) => {
    const childRows = !props.leaf && props.expanded
      ? div(store.getChildrenOf(props.id).map(child => Row(child)))
      : null;

    const isNotCode = !!(props.tags || []).find(tagKey => (
      tagKey === TAGS.ROOT.key ||
      tagKey === TAGS.GROUPING.key ||
      tagKey === TAGS.INFO.key
    ));

    const rowNameStyle = !isNotCode
      ? { fontFamily: `"Courier New", monospace` }
      : null;

    const notes = props.notes;
    const notesText = notes
      ? span({ className: `row__notes` },
        props.notes,
      )
      : null;

    let className = `row`;
    if (props.selected) className += ` row--selected`;

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
          className: `row__content`,
          onclick: () => store.selectItemById(props.id),
        },
        button(
          {
            onclick: e => expandOrCollapseRow(e, props),
            className: `row__triangle`,
            disabled: buttonDisabled,
          },
          buttonContent,
        ),

        div({ className: `row__words` },
          p({ className: `row__name` },
            span({ style: rowNameStyle },
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

export default Row;
