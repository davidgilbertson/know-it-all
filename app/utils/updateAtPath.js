import { getArrayPath } from '../utils';

export default function (object, path, prop, value) {
  const pathAsArray = getArrayPath(path);
  return object.updateIn(pathAsArray, item => item.set(prop, value));
};
