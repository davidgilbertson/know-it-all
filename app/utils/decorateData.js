let rowCount = 0;
let depth = 0;
let moduleCount = 0;
const itemList = [];

function parseData(items, path = [], parent) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    item.expanded = rowCount === 0; // need to mutate the item because children read it

    const pathArray = path.slice();
    pathArray.push(i);

    const hasChildren = item.children && item.children.length;
    const newItem = {
      name: item.name,
      id: item.id,
      row: rowCount,
      tags: item.tags,
      leaf: !hasChildren,
      expanded: item.expanded,
      depth,
    };

    // add the minimum number of props to the object
    // because it affects the data size
    if (!parent || parent.expanded) newItem.visible = true;
    if (parent) newItem.parentId = parent.id;

    itemList.push(newItem);

    rowCount += 1;

    if (hasChildren) {
      depth += 1;
      parseData(item.children, pathArray, item);
      depth -= 1;
    }
  }

  return items;
}

function decorateData(originalItemTree) {
  // don't reset rowCount between runs. Multiple chunks will be passed through here
  depth = 0;
  itemList.length = 0;

  parseData(originalItemTree.slice(), [moduleCount]);

  moduleCount += 1;
  return itemList.slice(); // don't return a reference to the array
}

export default decorateData;
