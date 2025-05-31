const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "vinay",
  database: "todo_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ MySQL connected");
});

module.exports = db;