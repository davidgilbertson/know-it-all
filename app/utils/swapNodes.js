export default (oldNode, newNode, suppressWarnings) => {
  if (oldNode.parentElement) {
    // TODO (davidg): check this isn't a memory leak waiting to happen
    oldNode.parentElement.replaceChild(newNode, oldNode);
  } else if (window.APP_DEBUG) {
    console.error(`Can't replace node because it doesn't have a parent`, oldNode);
  }

  if (window.APP_DEBUG && !suppressWarnings && oldNode.isEqualNode(newNode)) {
    console.warn(`A node was updated but there was no change in the rendered output`, newNode);
  }

  return newNode;
};
