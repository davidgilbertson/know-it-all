import { h } from 'preact'; /** @jsx h */

import TableRow from '../TableRow/TableRow';

const TableRows = (props) => {
  const tableRows = props.items.map(item => (
    <TableRow
      key={item.id}
      item={item}
      itemList={props.itemList}
      currentItem={props.currentItem}
      selectItem={props.selectItem}
      updateScore={props.updateScore}
      expand={props.expand}
      collapse={props.collapse}
    />
  ));

  return <div class="table-rows">{tableRows}</div>;
};

export default TableRows;
