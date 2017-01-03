export default (oldNode, newNode, suppressWarnings) => {
  if (oldNode.parentElement) {
    // TODO (davidg): check this isn't a memory leak waiting to happen
    oldNode.parentElement.replaceChild(newNode, oldNode);
  } else {
    console.error(`Can't replace node because it doesn't have a parent`, oldNode);
  }

  if (!suppressWarnings && oldNode.isEqualNode(newNode)) {
    console.warn(`A node was updated but there was no change in the rendered output`, newNode);
  }

  return newNode;
};
