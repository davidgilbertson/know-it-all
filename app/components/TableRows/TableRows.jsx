// import React from 'react';
import { h } from 'preact';
/** @jsx h */

import TableRow from '../TableRow/TableRow';
const Immutable = require(`immutable`);

const TableRows = props => {
  const arr = [];

  props.items.forEach(item => {
    arr.push(
      <TableRow
        key={item.get(`id`)}
        item={item}
        currentNugget={props.currentNugget}
        goToRow={props.goToRow}
        updateScore={props.updateScore}
        expandCollapse={props.expandCollapse}
        goToNextKnowableRow={props.goToNextKnowableRow}
      />
    );
  });

  return <div>{arr}</div>;
};

// TableRows.propTypes = {
//   // methods
//   goToRow: React.PropTypes.func,
//   updateScore: React.PropTypes.func,
//   expandCollapse: React.PropTypes.func,
//   goToNextKnowableRow: React.PropTypes.func,
//
//   // props
//   items: React.PropTypes.instanceOf(Immutable.List),
//   currentNugget: React.PropTypes.object,
// };

export default TableRows;
