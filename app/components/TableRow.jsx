import React, { Component, PropTypes } from 'react';

import {
  COLORS,
  SCORES,
  // KEYS,
} from '../constants.js';

class TableRow extends Component {
  constructor(props) {
    super(props);

    // this.onKeyUp = this.onKeyUp.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onTriangleClick = this.onTriangleClick.bind(this);
  }

  // componentDidMount() {
  //   // window.addEventListener(`keypress`, this.onKeyUp);
  // }
  //
  // componentWillUnmount() {
  //   // window.removeEventListener(`keypress`, this.onKeyUp);
  // }

  // onKeyUp(e) {
  //   const { props } = this;
  //   if (props.item.row !== props.activeRow) return;
  //   console.log(`  --  >  TableRow.jsx:26 > e.key`, e.key);
  //   console.log(`  --  >  TableRow.jsx:26 > e.repeat`, e.repeat);
  //   let scoredWithKey = false;
  //
  //   const saveScore = scoreNumber => {
  //     props.updateScore(props.path, SCORES[`LEVEL_${scoreNumber}`]);
  //   };
  //
  //   if (e.keyCode === KEYS.LEFT) {
  //     if (props.item.isExpanded) {
  //       props.expandCollapse(props.path, false);
  //     }
  //     return;
  //   }
  //
  //   if (e.keyCode === KEYS.RIGHT) {
  //     if (!props.item.isExpanded) {
  //       props.expandCollapse(props.path, true);
  //     }
  //     return;
  //   }
  //
  //   if (e.key === `0`) {
  //     saveScore(0);
  //     scoredWithKey = true;
  //   }
  //   if (e.key === `1`) {
  //     saveScore(1);
  //     scoredWithKey = true;
  //   }
  //   if (e.key === `2`) {
  //     saveScore(2);
  //     scoredWithKey = true;
  //   }
  //   if (e.key === `3`) {
  //     saveScore(3);
  //     scoredWithKey = true;
  //   }
  //
  //   if (scoredWithKey) {
  //     // This should make it visible whenever it becomes active.
  //     props.goToNextKnowableRow(); // move to the next one after scoring
  //   }
  // }

  onRowClick() {
    console.log(`  --  >  TableRow.jsx:75 > onRowClick`);
    const { props } = this;
    props.setActiveRow(props.item.row);
  }

  onTriangleClick(e) {
    console.log(`  --  >  TableRow.jsx:80 > onTriangleClick`);
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
      backgroundColor: selected ? `steelblue` : `white`,
      color: selected ? `white` : `steelblue`,
      border: `1px solid steelblue`,
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
          onChange={() => this.props.updateScore(this.props.path, displayScore)}
        />
        {displayScore.shortTitle}
      </label>
    );
  }

  render() {
    const { props } = this;

    const hasChildren = !!props.item.items && !!props.item.items.length;
    const isActiveRow = props.item.row === props.activeRow;

    const children = hasChildren
      ? props.item.items.map((item, i) => {
        const childPath = props.path.slice();
        childPath.push(i);

        return (
          <TableRow
            {...props}
            key={item.name}
            item={item}
            path={childPath}
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
            {/* {this.renderScoreButton(props.item, SCORES.LEVEL_0)} */}
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
  activeRow: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  path: PropTypes.array.isRequired,

  // methods
  updateScore: PropTypes.func.isRequired,
  setActiveRow: PropTypes.func.isRequired,
  expandCollapse: PropTypes.func.isRequired,
};

export default TableRow;
