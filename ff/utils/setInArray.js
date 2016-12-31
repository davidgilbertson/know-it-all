export default function (array, id, data) {
  return array.map(item => (
    item.id === id ? Object.assign({}, item, data) : item
  ));
}
