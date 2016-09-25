import cloneDeep from 'lodash/cloneDeep';

let rowCount;
let depth;
const nuggetList = [];

function parseData(nuggets, path = []) {
  for (let i = 0; i < nuggets.length; i++) {
    const nugget = nuggets[i];

    nugget.isExpanded = true;
    nugget.row = rowCount++;
    nugget.depth = depth;
    nugget.path = path.slice();
    nugget.path.push(i);

    const shallowNugget = cloneDeep(nugget);
    shallowNugget.items.length = 0;
    // the nugget list should only be used for navigating to the next/previous row
    // so include a subset of data (any other data wouldn't be updated)
    nuggetList.push({
      name: nugget.name,
      row: nugget.row,
      path: nugget.path,
      knowable: nugget.knowable,
    });

    if (nugget.items && nugget.items.length) {
      depth++;
      parseData(nugget.items, nugget.path);
      depth--;
    }
  }

  return nuggets;
}

export function decorateData(originalNuggetTree) {
  rowCount = 0;
  depth = 0;
  nuggetList.length = 0;
  const nuggetTree = parseData(cloneDeep(originalNuggetTree));

  return {
    nuggetTree,
    nuggetList,
  };
}
