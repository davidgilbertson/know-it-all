const express = require(`express`);
const compression = require(`compression`);

const app = express();

app.use(compression());
app.use(express.static(`public`));

app.listen(8080, (err) => {
  if (err) console.error(err);
  console.info(`Server ready on port 8080`);
});
