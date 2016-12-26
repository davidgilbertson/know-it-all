import {
  SCORES,
} from '../constants';

let rowCount;
let depth = 0;
const itemList = [];
let topLevelRow = 0;

function parseData(items, path = [], parent) {
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];

    // have the first two top-level modules expanded to one level
    // so I'm not producing too much DOM (that's still 43 rows)
    topLevelRow += depth === 0 ? 1 : 0;
    item.expanded = depth < 1 && topLevelRow < 3; // need to mutate the item because children read it

    const pathArray = path.slice();
    pathArray.push(i);

    const newItem = {
      name: item.name,
      id: item.id,
      row: rowCount,
      pathString: pathArray.join(`.`),
      tags: item.tags,
      depth,
    };

    if (!parent || parent.expanded) newItem.visible = true;
    if (parent) newItem.parentId = parent.id;
    if (depth < 1 && topLevelRow < 3) {
      item.expanded = true;
      newItem.expanded = true;
    }

    itemList.push(newItem);
    // itemList.push({
    //   name: item.name,
    //   id: item.id,
    //   row: rowCount,
    //   pathString: pathArray.join(`.`),
    //   tags: item.tags,
    //   scoreKey: SCORES.LEVEL_0.key,
    //   visible: !parent || parent.expanded,
    //   parentId: parent ? parent.id : null,
    //   expanded: item.expanded,
    //   depth,
    // });

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
  rowCount = 0;
  depth = 0;
  itemList.length = 0;

  parseData(originalItemTree.slice());
  // console.log(`  --  >  decorateData.js:55 > decorateData > itemList:`, itemList);
  // console.time(`get-children-of`);
  // const childrenOfMedia = itemList.filter(item => item.parentId === `zf19pklN`);
  // console.timeEnd(`get-children-of`);
  // console.log(`  --  >  decorateData.js:59 > decorateData > childrenOfMedia:`, childrenOfMedia);
  return itemList;
}

export default decorateData;
