//Importera sqlite
const sql = require('sqlite3').verbose();

//Skapa databasen
const db = new sql.Database('./db/moment1.db');

db.run(`DELETE FROM courses`);
