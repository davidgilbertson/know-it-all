import React, { Component, PropTypes } from 'react';

import {
  SCORES,
  KEYS,
} from '../constants.js';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    window.addEventListener(`keydown`, this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener(`keydown`, this.onKeyDown);
  }

  onKeyDown(e) {
    if (this.props.item.row !== this.props.activeRow) return;
    const { item } = this.props;

    const saveScore = scoreNumber => {
      this.props.onChange(this.props.path, SCORES[`LEVEL_${scoreNumber}`]);
    };

    if (e.keyCode === KEYS.LEFT) {
      if (item.score.key <= 0) return;

      saveScore(item.score.key - 1);

      return;
    }

    if (e.keyCode === KEYS.RIGHT) {
      if (item.score.key >= 3) return;
      saveScore(item.score.key + 1);

      return;
    }

    if (e.keyCode === KEYS.TOP_0 || e.keyCode === KEYS.NUM_0) {
      saveScore(0);

      return;
    }
    if (e.keyCode === KEYS.TOP_1 || e.keyCode === KEYS.NUM_1) {
      saveScore(1);

      return;
    }
    if (e.keyCode === KEYS.TOP_2 || e.keyCode === KEYS.NUM_2) {
      saveScore(2);

      return;
    }
    if (e.keyCode === KEYS.TOP_3 || e.keyCode === KEYS.NUM_3) {
      saveScore(3);

      return;
    }
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
    const selected = item.score.key === displayScore.key;

    const labelStyle = {
      display: `inline-block`,
      backgroundColor: selected ? `steelblue` : `white`,
      color: selected ? `white` : `steelblue`,
      border: `1px solid steelblue`,
      padding: 10,
      borderRadius: `4px`,
      margin: 10,
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
          onChange={() => this.props.onChange(this.props.path, displayScore)}
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
            key={item.name}
            item={item}
            activeRow={props.activeRow}
            path={childPath}
            onChange={props.onChange}
            setActiveRow={props.setActiveRow}
          />
        );
      })
      : null;

    const styles = {
      row: {
        position: `relative`,
        marginLeft: 16,
        borderTop: `1px solid #ddd`,
        borderLeft: `1px solid #eee`,
      },
      content: {
        position: `relative`,
        paddingLeft: 13,
        transition: `150ms`,
        backgroundColor: isActiveRow ? `#c5cae9` : ``,
        boxShadow: `inset 4px 0 ${props.item.score.color}`,
      },
      name: {
        display: `inline-block`,
      },
      tagWrapper: {
        display: `inline-block`,
        paddingLeft: 10,
      },
      scoreWrapper: {
        display: `inline-block`,
        float: `right`,
      },
    };

    return (
      <div style={styles.row}>
        <div
          style={styles.content}
          onClick={() => props.setActiveRow(props.item.row)}
        >
          <h2 style={styles.name}>{props.item.row}. {props.item.name}</h2>

          <div style={styles.tagWrapper}>
            {this.renderTags(props.item.tags)}
          </div>

          <div style={styles.scoreWrapper}>
            {this.renderScoreButton(props.item, SCORES.LEVEL_0)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_1)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_2)}
            {this.renderScoreButton(props.item, SCORES.LEVEL_3)}
          </div>
        </div>

        {children}
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
  onChange: PropTypes.func.isRequired,
  setActiveRow: PropTypes.func.isRequired,
};

export default TableRow;
