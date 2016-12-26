import {
  SCORES,
  TAGS,
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
    item.expanded = depth < 1 && topLevelRow < 3;
    item.row = rowCount;
    item.depth = depth;
    item.leaf = !item.children || !item.children.length;
    item.scoreKey = SCORES.LEVEL_0.key;
    item.tagUid = item.tags.join(); // used to memoize tag rendering
    item.tags = item.tags.map(tagString => TAGS[tagString]).filter(tag => !!tag);

    if (!parent || parent.expanded) {
      item.visible = true;
    }

    const pathArray = path.slice();
    pathArray.push(i);
    item.pathString = pathArray.join(`.`);

    itemList.push({
      name: item.name,
      id: item.id,
      row: item.row,
      pathString: item.pathString,
      leaf: item.leaf,
      tags: item.tags,
      tagUid: item.tagUid,
      scoreKey: item.scoreKey,
      expanded: item.expanded,
      visible: item.visible,
      depth: item.depth,
      parentId: parent ? parent.id : null,
    });

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

  const itemTree = parseData(originalItemTree.slice());
  // console.log(`  --  >  decorateData.js:55 > decorateData > itemList:`, itemList);
  // console.time(`get-children-of`);
  // const childrenOfMedia = itemList.filter(item => item.parentId === `zf19pklN`);
  // console.timeEnd(`get-children-of`);
  // console.log(`  --  >  decorateData.js:59 > decorateData > childrenOfMedia:`, childrenOfMedia);
  return {
    itemTree,
    itemList,
  };
}

export default decorateData;
