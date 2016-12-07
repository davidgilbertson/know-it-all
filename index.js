process.env.NODE_ENV = `production`;
require(`babel-register`);
require(`./app/server/server.js`);
