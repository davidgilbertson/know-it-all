require(`babel-register`);
const fs = require(`fs`);
const path = require(`path`);
const crypto = require(`crypto`);
const decorateData = require(`./app/utils/decorateData`).default;

function saveModule(fileName, fileContents) {
  const fileHash = crypto.createHash(`md5`).update(fileContents).digest(`hex`);
  const hashedFileName = fileName.replace(`[hash]`, fileHash);

  fs.writeFile(path.resolve(__dirname, `./public/${hashedFileName}`), fileContents, `utf8`, (writeError) => {
    console.log(`  --  >  test.js:25 > saved ${hashedFileName}`);
    if (writeError) console.error(`Error writing data.js:`, writeError);
  });
}

fs.readFile(path.resolve(__dirname, `./app/data/data.json`), `utf8`, (readError, data) => {
  const fullItemTree = JSON.parse(data);

  const dataFiles = [];
  const firstModule = fullItemTree.shift();
  const firstItemList = decorateData([firstModule]);

  const fileContents = (
    `window.DATA = ${JSON.stringify(firstItemList)};`
  );

  saveModule(`firstModule.[hash].js`, fileContents);

  fullItemTree.forEach((dataModule) => {
    // TODO (davidg): change decorateData rather than wrap in array here and above
    const itemList = decorateData([dataModule]);
    const fileName = `${dataModule.name}.[hash].js`;
    dataFiles.push(fileName);
    saveModule(fileName, JSON.stringify(itemList));
  });
});
