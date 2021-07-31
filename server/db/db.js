const Sequelize = require("sequelize");
require("dotenv").config();

console.log("environment process", process.env.DB_NAME);

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

module.exports = db;
