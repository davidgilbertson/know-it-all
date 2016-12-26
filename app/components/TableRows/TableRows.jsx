import { h } from 'preact'; /** @jsx h */

import TableRow from '../TableRow/TableRow';

const TableRows = (props) => {
  const arr = [];

  props.items.forEach((item) => {
    arr.push(
      <TableRow
        key={item.id}
        item={item}
        itemList={props.itemList}
        currentItem={props.currentItem}
        selectItem={props.selectItem}
        updateScore={props.updateScore}
        expand={props.expand}
        collapse={props.collapse}
      />,
    );
  });

  return <div>{arr}</div>;
};

export default TableRows;
