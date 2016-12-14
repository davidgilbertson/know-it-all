// import React, { Component, PropTypes } from 'react';
import { h, Component } from 'preact';
/** @jsx h */

import TableRows from '../TableRows/TableRows';
import Icon from '../Icon/Icon';
import ScoreButtons from '../ScoreButtons/ScoreButtons';
const Immutable = require(`immutable`);
import classnames from 'classnames';

import {
  TAGS,
} from '../../constants.js';

if (process.env.IMPORT_SCSS) require(`./TableRow.scss`); // eslint-disable-line global-require

const renderTags = (tags) => {
  if (!tags.size) return ``;
  const result = [];

  tags.forEach(tag => {
    result.push(
      <span
        key={tag.get(`key`)}
        className="table-row__tag"
        title={tag.get(`value`)}
      >
        {tag.get(`key`)}
      </span>
    );
  });

  return result;
};

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
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

  onRowClick() {
    const { props } = this;
    // React will batch the setState()s that these two trigger
    // so there will only be one render
    props.goToRow(props.item.get(`row`));
    props.expandCollapse(props.item.get(`pathString`), !props.item.get(`isExpanded`));
  }

  render() {
    const { props } = this;

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

    const isNotCode = !!props.item.get(`tags`).find(tag => (
      tag.get(`key`) === TAGS.ROOT.key ||
      tag.get(`key`) === TAGS.GROUPING.key ||
      tag.get(`key`) === TAGS.INFO.key
    ));

    const className = classnames(
      `table-row`,
      { 'table-row--selected': isActiveRow },
      { 'table-row--has-no-children': !hasChildren },
      { 'table-row--expanded': props.item.get(`isExpanded`) }
    );

    const tableRowNameStyle = !isNotCode ? {
      fontFamily: `monospace`,
      fontSize: `100%`,
    } : null;

    const notes = props.item.get(`notes`);
    const notesText = notes
    ? (
      <p className="table-row__notes">
        ({props.item.get(`notes`)})
      </p>
    ) : null;

    return (
      <div className={className}>
        <div
          className="table-row__content"
          onMouseDown={this.onRowClick}
          onTouchStart={this.onRowClick}
        >
          <div className="table-row__triangle-wrapper">
            <Icon
              className="table-row__triangle-icon"
              icon={Icon.ICONS.downChevron}
              size="20"
            />
          </div>

          <div className="table-row__words">
            <p
              style={tableRowNameStyle}
              className="table-row__name"
            >
              {props.item.get(`name`)}
            </p>

            {notesText}

            <div className="table-row__tag-wrapper">
              {renderTags(props.item.get(`tags`))}
            </div>
          </div>

          <ScoreButtons
            item={props.item}
            updateScore={props.updateScore}
          />
        </div>

        {childRows}
      </div>
    );
  }
}

// TableRow.propTypes = {
//   // data
//   currentNugget: PropTypes.object.isRequired,
//   item: PropTypes.instanceOf(Immutable.Map).isRequired,
//
//   // methods
//   updateScore: PropTypes.func.isRequired,
//   goToRow: PropTypes.func.isRequired,
//   expandCollapse: PropTypes.func.isRequired,
// };

export default TableRow;
