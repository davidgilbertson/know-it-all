import express from 'express';
import compression from 'compression';
import appHtml from './appHtml';
import { PORT } from '../constants';

const app = express();
app.use(compression());

// In dev mode, generate the html dynamically
// otherwise, serve everything from public
// so for testing 'production' locally I'll get the index.html served from public
if (process.env.NODE_ENV !== `production`) {
  app.get(`/`, (req, res) => {
    res.send(appHtml({ mode: `dev` }));
  });
}

app.use(express.static(`public`));
app.use(express.static(`app/data`)); // default location for data.json

app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});
