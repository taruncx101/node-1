const { Sequelize } = require("sequelize");

const host = "localhost";
const username = "postgres";
const password = "codelogicx101";
const database = "node-assignment-1";
const dialect = "postgres";

const sequelize = new Sequelize(database, username, password, { host, dialect });


module.exports = sequelize;
