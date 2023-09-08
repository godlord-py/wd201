const Sequelize = require("sequelize");

const database = "todo_db";
const username = "godlord";
const password = "300678";
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
});
const connect = async () => {
    return sequelize.authenticate();
  }
  
  module.exports = {
    connect,
    sequelize
  }
  