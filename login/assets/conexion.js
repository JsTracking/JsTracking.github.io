const mysql = require("mysql");
//put here the credentials of access
module.exports = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "jstracking",
    database: "jstracking"
});
connection.query("SELECT * FROM usuarios", function(error, result, fields){
    if(error) throw error
   
   console.log(result)
   
   })