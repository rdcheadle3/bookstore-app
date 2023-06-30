const pgp = require('pg-promise')();

const connectionString = 'postgres://postgres:#Bobc0151#@localhost:5432/bookstore_database';
const db = pgp(connectionString);

module.exports = db;