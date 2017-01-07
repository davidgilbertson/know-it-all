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
    if (props.expanded) className += ` row--expanded`;

    let buttonContent;
    let buttonDisabled = false;

    if (props.leaf) {
      buttonContent = `●`;
      buttonDisabled = true;
    } else {
      buttonContent = `▼`;
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

        ScoreButtons({ item: props }),
      ),
      childRows,
    );
  };

  store.listen(initialProps.id, (newData) => {
    el = swapNodes(el, render(newData));
  });

  el = render(initialProps);

  return el;
};

export default Row;
