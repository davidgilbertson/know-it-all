import React, { Component, PropTypes } from 'react';

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // TODO (davidg): not state, can't change
      hasChildren: !!props.item.items && !!props.item.items.length,
    };
  }

  renderTags(tags) {
    if (!tags.length) return ``;

    const tagStyle = {
      borderRadius: 4,
      backgroundColor: `#888`,
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

  render() {
    const { props, state } = this;

    const children = state.hasChildren
      ? props.item.items.map(row => <TableRow item={row} depth={props.depth + 1} />)
      : null;

    const styles = {
      row: {
        marginLeft: 10 * props.depth,
        border: '1px solid red',
      },
    };

    return (
      <div style={styles.row}>
        <h2>{props.item.title}</h2>
        {this.renderTags(props.item.tags)}
        {children}
      </div>
    );
  }
}

TableRow.propTypes = {
  depth: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
};

export default TableRow;
