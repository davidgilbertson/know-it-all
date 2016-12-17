// import { h } from 'preact'; /** @jsx h */
import Inferno from 'inferno'; /** @jsx Inferno */

import TableRow from '../TableRow/TableRow';

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

export default TableRows;
