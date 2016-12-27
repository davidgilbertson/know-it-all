import express from 'express';
import compression from 'compression';
import appHtml from './appHtml';
import { PORT } from '../constants';
import { decorateData } from '../utils';

const app = express();
app.use(compression());

const dataFileNames = require(`../data/dataFileNames.json`);
const data = require(`../data/data.json`);
const itemList = decorateData([data[0]]);

// In dev mode, generate the html dynamically
// otherwise, serve everything from public
// so for testing 'production' locally I'll get the index.html served from public
if (process.env.NODE_ENV !== `production`) {
  // app.get(`/generate-data.js`, (req, res) => {
  //   res
  //   .set(`Content-Type`, `application/javascript`)
  //   .send(`window.DATA = ${JSON.stringify(itemList)};`);
  // });

  app.get(`/`, (req, res) => {
    console.log(`  --  >  server.js:25 >  > req.url:`, req.url);
    res.send(appHtml({
      mode: `dev`,
      data: itemList,
      dataFileNames,
    }));
  });
}

app.use(express.static(`public`));
// app.use(express.static(`app/data`)); // default location for data.json

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});
