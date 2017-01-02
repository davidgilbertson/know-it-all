process.env.NODE_ENV = process.env.NODE_ENV || `production`;

require(`babel-register`);
require(`./prod`);
