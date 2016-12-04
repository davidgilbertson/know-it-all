import React, { Component, PropTypes } from 'react';
import TableRows from './TableRows';
const Immutable = require(`immutable`);

import {
  COLORS,
  SCORES,
  TAGS,
} from '../constants.js';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
    this.onTriangleClick = this.onTriangleClick.bind(this);
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
    if (this.props.item.get(`id`) === this.props.currentNugget.id) {
      if (typeof this.el.scrollIntoViewIfNeeded === `function`) {
        this.el.scrollIntoViewIfNeeded();
      }
    }
  }

  onRowClick() {
    const { props } = this;
    props.goToRow(props.item.get(`row`));
  }

  onTriangleClick(e) {
    const { props } = this;
    if (!props.item.get(`children`).size) return;

    props.expandCollapse(props.item.get(`pathString`), !props.item.get(`isExpanded`));
    e.stopPropagation(); // don't select the row
  }

  renderTags(tags) {
    if (!tags.size) return ``;

    const tagStyle = {
      borderRadius: 4,
      backgroundColor: `#ddd`,
      padding: `2px 6px`,
      marginLeft: 4,
      fontSize: 12,
    };

    return tags.map(tag => (
      <span
        key={tag.get(`key`)}
        style={tagStyle}
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

    const selected = item.get(`score`).key === displayScore.key;

    const labelStyle = {
      display: `inline-block`,
      backgroundColor: selected ? COLORS.PRIMARY : COLORS.WHITE,
      color: selected ? COLORS.WHITE : COLORS.PRIMARY,
      border: `1px solid ${COLORS.PRIMARY}`,
      padding: 10,
      borderRadius: 4,
      marginRight: 10,
      userSelect: `none`,
    };

    const inputStyle = {
      position: `absolute`,
      transform: `translateX(-100vw)`,
    };

    return (
      <label
        style={labelStyle}
        title={displayScore.value}
      >
        <input
          style={inputStyle}
          type="radio"
          name={`${item.get(`id`)}-${item.get(`name`)}`}
          selected={selected}
          onChange={() => this.props.updateScore(item.get(`pathString`), displayScore)}
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

    const styles = {
      row: {
        position: `relative`,
        marginLeft: 20,
        borderLeft: `1px solid #eee`,
      },
      content: {
        display: `flex`,
        alignItems: `center`,
        height: 60,
        paddingLeft: 13,
        transition: `150ms`,
        borderBottom: `1px solid #ddd`,
        backgroundColor: isActiveRow ? COLORS.GREY_DARK : ``,
        color: isActiveRow ? COLORS.WHITE : ``,
        boxShadow: `inset 4px 0 ${props.item.get(`score`).color}`,
      },
      name: {},
      triangle: {
        display: children && children.size ? `` : `none`,
        margin: `0 10px 0 -37px`,
        padding: 7, // for decent click area
        transform: props.item.get(`isExpanded`) ? `rotate(90deg)` : ``,
        transition: `150ms`,
        color: COLORS.GREY_MID,
        cursor: `pointer`,
        userSelect: `none`,
      },
      // children: {
      //   display: !props.item.get(`isExpanded `)? `none` : ``,
      // },
      tagWrapper: {
        paddingLeft: 10,
        color: COLORS.GREY_DARK,
      },
      scoreWrapper: {
        flex: 1,
        textAlign: `right`,
        marginRight: 10,
      },
      doNotCareButton: {
        width: 60,
        padding: 5,
        border: `1px solid ${COLORS.GREY_DARK}`,
        borderRadius: 4,
        backgroundColor: COLORS.WHITE,
        color: COLORS.GREY_DARK,
        textTransform: `uppercase`,
        fontSize: 14,
        marginRight: 10,
      },
    };

    const tags = props.item.get(`tags`).toJS();

    const isNotCode = tags.some(tag => (
      tag.key === TAGS.ROOT.key || tag.key === TAGS.GROUPING.key || tag.key === TAGS.INFO.key
    ));

    if (!isNotCode) {
      styles.name.fontFamily = `monospace`;
      styles.name.fontSize = `110%`;
    }

    return (
      <div
        style={styles.row}
        ref={el => (this.el = el)}
      >
        <div
          style={styles.content}
          onClick={this.onRowClick}
        >
          <div
            style={styles.triangle}
            onClick={this.onTriangleClick}
          >▶</div>

          <p style={styles.name}>
            {props.item.get(`name`)}
          </p>

          <div style={styles.tagWrapper}>
            {this.renderTags(props.item.get(`tags`))}
          </div>

          <div style={styles.scoreWrapper}>
            {this.renderScoreButton(props.item, SCORES.LEVEL_1)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_2)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_3)}
          </div>

          <button style={styles.doNotCareButton}>Don't care</button>
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
