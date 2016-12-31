import express from 'express';
import generateHtml from './generateHtml';

const app = express();

const dataMock = [
  {
    name: `CSS`,
    id: `1234`,
  },
  {
    name: `HTML`,
    id: `123443`,
  },
];

const html = generateHtml(dataMock);

app.use(express.static(`ff/public`));

app.get(`/`, (req, res) => {
  res.send(html);
});

app.listen(8080);
