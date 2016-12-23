export default function (stringPath) {
  return stringPath.replace(/\./g, `.children.`).split(`.`);
};
