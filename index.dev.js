process.env.NODE_ENV = `development`;
require(`babel-register`);
require(`./app/server/server.js`);
require(`./webpack/devServer.js`);
