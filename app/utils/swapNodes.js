export default (oldNode, newNode) => {
  if (oldNode.parentElement) {
    // TODO (davidg): check this isn't a memory leak waiting to happen
    oldNode.parentElement.replaceChild(newNode, oldNode);
  } else {
    console.error(`Can't replace node because it doesn't have a parent`, oldNode);
  }
};
