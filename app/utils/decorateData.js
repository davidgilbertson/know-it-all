let rowCount = 0;

function parseData(dataItems) {
  for (let i = 0; i < dataItems.length; i++) {
    const item = dataItems[i];

    item.row = rowCount++;

    if (item.items && item.items.length) {
      parseData(item.items);
    }
  }

  return dataItems;
}


export function decorateData(dataItems) {
  const newDataItems = dataItems.slice();
  return parseData(newDataItems);
}
