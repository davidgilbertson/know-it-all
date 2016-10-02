import React, { Component, PropTypes } from 'react';

import {
  COLORS,
  SCORES,
} from '../constants.js';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.onRowClick = this.onRowClick.bind(this);
    this.onTriangleClick = this.onTriangleClick.bind(this);
  }

  onRowClick() {
    const { props } = this;
    props.goToRow(props.item.row);
  }

  onTriangleClick(e) {
    const { props } = this;
    if (!props.item.items.length) return;

    props.expandCollapse(props.item.path, !props.item.isExpanded);
    e.stopPropagation(); // don't select the row
  }

  renderTags(tags) {
    if (!tags.length) return ``;

    const tagStyle = {
      borderRadius: 4,
      backgroundColor: `#ddd`,
      padding: `4px`,
    };

    return tags.map(tag => (
      <span
        key={tag.key}
        style={tagStyle}
        title={tag.value}
      >
        {tag.key}
      </span>
    ));
  }

  renderScoreButton(item, displayScore) {
    if (
      (displayScore === SCORES.LEVEL_3 || displayScore === SCORES.LEVEL_2)
      && !item.knowable
    ) return null;

    const selected = item.score.key === displayScore.key;

    const labelStyle = {
      display: `inline-block`,
      backgroundColor: selected ? COLORS.PRIMARY : COLORS.WHITE,
      color: selected ? COLORS.WHITE : COLORS.PRIMARY,
      border: `1px solid ${COLORS.PRIMARY}`,
      padding: 10,
      borderRadius: `4px`,
      marginRight: 10,
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
          name={`${item.name}-options`}
          selected={selected}
          onChange={() => this.props.updateScore(this.props.item.path, displayScore)}
        />
        {displayScore.shortTitle}
      </label>
    );
  }

  render() {
    const { props } = this;

    const hasChildren = !!props.item.items && !!props.item.items.length;
    const isActiveRow = props.item.row === props.currentNugget.row;

    const children = hasChildren
      ? props.item.items.map((item) => {

        return (
          <TableRow
            {...props}
            key={item.name}
            item={item}
          />
        );
      })
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
        boxShadow: `inset 4px 0 ${props.item.score.color}`,
      },
      name: {},
      triangle: {
        display: props.item.items.length ? `` : `none`,
        margin: `0 10px 0 -37px`,
        padding: 7, // for decent click area
        transform: props.item.isExpanded ? `rotate(90deg)` : ``,
        transition: `150ms`,
        color: COLORS.GREY_MID,
        cursor: `pointer`,
      },
      children: {
        display: !props.item.isExpanded ? `none` : ``,
      },
      tagWrapper: {
        paddingLeft: 10,
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
        fontSize: 12,
        marginRight: 10,
      },
    };

    if (props.item.isCode) {
      styles.name.fontFamily = `monospace`;
      styles.name.fontSize = `110%`;
    }

    return (
      <div style={styles.row}>
        <div
          style={styles.content}
          onClick={this.onRowClick}
        >
          <div
            style={styles.triangle}
            onClick={this.onTriangleClick}
          >▶</div>

          <p style={styles.name}>
            {props.item.name}
          </p>

          <div style={styles.tagWrapper}>
            {this.renderTags(props.item.tags)}
          </div>

          <div style={styles.scoreWrapper}>
            {this.renderScoreButton(props.item, SCORES.LEVEL_1)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_2)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_3)}
          </div>

          <button style={styles.doNotCareButton}>Don't care</button>
        </div>

        <div style={styles.children}>
          {children}
        </div>
      </div>
    );
  }
}

TableRow.propTypes = {
  // data
  currentNugget: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,

  // methods
  updateScore: PropTypes.func.isRequired,
  goToRow: PropTypes.func.isRequired,
  expandCollapse: PropTypes.func.isRequired,
};

export default TableRow;
