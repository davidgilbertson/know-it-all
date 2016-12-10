import React, { Component, PropTypes } from 'react';
import TableRows from '../TableRows/TableRows';
import Icon from '../Icon/Icon';
const Immutable = require(`immutable`);
import classnames from 'classnames';

import {
  SCORES,
  TAGS,
} from '../../constants.js';

if (process.env.IMPORT_SCSS) require(`./TableRow.scss`); // eslint-disable-line global-require

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
    // this.onTriangleClick = this.onTriangleClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const thisProps = this.props;

    if (nextProps.item !== thisProps.item) return true;

    const selectedItemChanged = thisProps.currentNugget.id !== nextProps.currentNugget.id;

    if (selectedItemChanged) {
      const oldItemSelectedIsInTree = thisProps.currentNugget.pathString.startsWith(thisProps.item.get(`pathString`));
      const newItemSelectedIsInTree = nextProps.currentNugget.pathString.startsWith(nextProps.item.get(`pathString`));

      if (oldItemSelectedIsInTree || newItemSelectedIsInTree) {
        return true;
      }
    }

    return false;
  }

  componentDidUpdate() {
    // When selected, scroll the item into view
    // scrollIntoViewIfNeeded() is a jerk, do something with scrolling the window
    // where is that sin wave window scroll thing I did?
    // if (this.props.item.get(`id`) === this.props.currentNugget.id) {
    //   if (typeof this.el.scrollIntoViewIfNeeded === `function`) {
    //     this.el.scrollIntoViewIfNeeded();
    //   }
    // }
  }

  onRowClick() {
    const { props } = this;
    // React will batch the setState()s that these two trigger
    // so there will only be one render
    props.goToRow(props.item.get(`row`));
    props.expandCollapse(props.item.get(`pathString`), !props.item.get(`isExpanded`));
  }

  renderTags(tags) {
    if (!tags.size) return ``;

    return tags.map(tag => (
      <span
        key={tag.get(`key`)}
        className="table-row__tag"
        title={tag.get(`value`)}
      >
        {tag.get(`key`)}
      </span>
    ));
  }

  renderScoreButton(item, displayScore) {
    if (
      (displayScore === SCORES.LEVEL_3 || displayScore === SCORES.LEVEL_2)
      && !item.get(`leaf`)
    ) return null;

    const selected = item.get(`scoreKey`) === displayScore.key;

    const scoreButtonClassName = classnames(
      `table-row__score-button`,
      { 'table-row__score-button--selected': selected }
    );

    return (
      <label
        className={scoreButtonClassName}
        title={displayScore.value}
      >
        <input
          className="table-row__score-button-input"
          type="radio"
          name={`${item.get(`id`)}-${item.get(`name`)}`}
          selected={selected}
          onChange={() => this.props.updateScore(item.get(`pathString`), displayScore.key)}
        />
        {displayScore.shortTitle}
      </label>
    );
  }

  render() {
    const { props } = this;
    // TODO (davidg): is it as fast/faster to just to item.toJS() once rather than 10 gets?

    const children = props.item.get(`children`);

    const hasChildren = !!children && !!children.size;
    const isActiveRow = props.item.get(`row`) === props.currentNugget.row;

    const childRows = hasChildren && props.item.get(`isExpanded`)
      ? (
      <TableRows
        items={children}
        currentNugget={props.currentNugget}
        goToRow={props.goToRow}
        updateScore={props.updateScore}
        expandCollapse={props.expandCollapse}
        goToNextKnowableRow={props.goToNextKnowableRow}
      />
      )
      : null;

    const tags = props.item.get(`tags`).toJS();

    const isNotCode = tags.some(tag => (
      tag.key === TAGS.ROOT.key || tag.key === TAGS.GROUPING.key || tag.key === TAGS.INFO.key
    ));

    const className = classnames(
      `table-row`,
      { 'table-row--code': !isNotCode },
      { 'table-row--selected': isActiveRow },
      { 'table-row--has-no-children': !hasChildren },
      { 'table-row--expanded': props.item.get(`isExpanded`) }
    );

    const scoreKey = props.item.get(`scoreKey`);
    const score = SCORES[scoreKey];
    const contentStyle = {
      boxShadow: `inset 4px 0 ${score.color}`,
    };

    // TODO (davidg): only create triangle here if needed
    // remove CSS that hides it

    const notes = props.item.get(`notes`);
    const notesText = notes
      ? (
        <p className="table-row__notes">
          ({props.item.get(`notes`)})
        </p>
      ) : null;

    return (
      <div
        className={className}
        ref={el => (this.el = el)}
      >
        <div
          className="table-row__content"
          style={contentStyle}
          onClick={this.onRowClick}
        >
          <div className="table-row__words">
            <p className="table-row__name">
              {props.item.get(`name`)}
            </p>

            {notesText}

            <div className="table-row__tag-wrapper">
              {this.renderTags(props.item.get(`tags`))}
            </div>

            <div className="table-row__score-wrapper">
              {this.renderScoreButton(props.item, SCORES.LEVEL_1)}
              {this.renderScoreButton(props.item, SCORES.LEVEL_2)}
              {this.renderScoreButton(props.item, SCORES.LEVEL_3)}
            </div>

            <button className="table-row__do-not-care-button">Don't care</button>
          </div>

          <div
            className="table-row__triangle-wrapper"
          >
            <Icon
              className="table-row__triangle-icon"
              icon={Icon.ICONS.downChevron}
              size="24"
            />
          </div>
        </div>

        {childRows}
      </div>
    );
  }
}

TableRow.propTypes = {
  // data
  currentNugget: PropTypes.object.isRequired,
  item: PropTypes.instanceOf(Immutable.Map).isRequired,

  // methods
  updateScore: PropTypes.func.isRequired,
  goToRow: PropTypes.func.isRequired,
  expandCollapse: PropTypes.func.isRequired,
};

export default TableRow;
