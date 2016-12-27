import {
  SCORES,
} from '../constants';

let rowCount = 0;
let depth = 0;
let moduleCount = 0;
const itemList = [];
let topLevelRow = 0;

function parseData(items, path = [], parent) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    // have the first two top-level modules expanded to one level
    // so I'm not producing too much DOM (that's still 43 rows)
    topLevelRow += depth === 0 ? 1 : 0; // TODO (davidg): this can go now I'm loading in chunks
    item.expanded = depth < 1 && topLevelRow < 3; // need to mutate the item because children read it

    const pathArray = path.slice();
    pathArray.push(i); // TODO (davidg): this pushes an extra 0 at the start, do it after newItem
    // pathArray.push(item.id);

    const newItem = {
      name: item.name,
      id: item.id,
      row: rowCount,
      pathString: pathArray.join(`.`),
      tags: item.tags,
      depth,
    };

    // add the minimum number of props to the object
    // because it affects the data size
    if (!parent || parent.expanded) newItem.visible = true;
    if (parent) newItem.parentId = parent.id;
    if (depth < 1 && topLevelRow < 3) {
      item.expanded = true;
      newItem.expanded = true;
    }

    itemList.push(newItem);

    rowCount += 1;

    if (item.children && item.children.length) {
      depth += 1;
      parseData(item.children, pathArray, item);
      depth -= 1;
    }
  }

  return items;
}

function decorateData(originalItemTree) {
  // don't reset rowCount between runs. Multiple chunks will be passed through here
  // rowCount = 0;
  depth = 0;
  itemList.length = 0;

  parseData(originalItemTree.slice(), [moduleCount]);

  moduleCount += 1;
  return itemList.slice(); // don't return a reference to the array
}

export default decorateData;
