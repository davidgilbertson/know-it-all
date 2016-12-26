require(`babel-register`);
const fs = require(`fs`);
const path = require(`path`);
const crypto = require(`crypto`);
const decorateData = require(`./app/utils/decorateData`).default;

fs.readFile(path.resolve(__dirname, `./app/data/data.json`), `utf8`, (readError, data) => {
  const json = JSON.parse(data);
  console.log(`  --  >  test.js:5 >  > json.length:`, json.length);
  const itemList = decorateData(json);
  console.log(`  --  >  test.js:8 >  > itemList.length:`, itemList.length);

  const dataMock = {
    that: `this`,
    num: 3,
    notTrue: false,
  };

  const fileContents = (
    `window.DATA = ${JSON.stringify(itemList)};`
  );

  // console.log(`  --  >  test.js:17 >  > fileContents:`, fileContents);

  const fileHash = crypto.createHash(`md5`).update(fileContents).digest(`hex`);

  fs.writeFile(path.resolve(__dirname, `./public/test.${fileHash}.js`), fileContents, `utf8`, (writeError) => {
    console.log(`  --  >  test.js:25 > DONE!!`);
    if (writeError) console.error(`Error writing data.js:`, writeError);
  });
});
