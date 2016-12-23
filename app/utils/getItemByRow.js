import { getArrayPath } from '../utils';

export default function (data, row) {
  const activeNugget = data.nuggetList.find(nugget => nugget.row === row);
  const pathAsArray = getArrayPath(activeNugget.pathString);
  const itemByPath = data.itemTree.getIn(pathAsArray);

  return itemByPath;
};
