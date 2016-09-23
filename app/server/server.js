import express from 'express';
const app = express();

import appHtml from './appHtml.js';
import { PORT } from '../constants.js';

app.use(express.static(`static`));

app.get(`*`, (req, res) => {
  res.send(appHtml);
});

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});
