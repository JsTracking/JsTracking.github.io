const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "jstracking",
  });
  connection.connect((err) => {
    if (err) throw err; // not connected!
    console.log("Connected to MySQL");
  });

module.exports = {connection}