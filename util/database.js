const { Sequelize } = require("sequelize");

// const host = "localhost";
// const username = "postgres";
// const password = "codelogicx101";
// const database = "node-assignment-1";
// const dialect = "postgres";

const host = process.env.DB_HOST;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const dialect = process.env.DB_CONNECTION;
const port = process.env.DB_PORT;


const sequelize = new Sequelize(database, username, password, { host, dialect });


module.exports = sequelize;
