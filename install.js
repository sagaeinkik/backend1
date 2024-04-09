//Importera sqlite
const sql = require('sqlite3').verbose();

//Skapa databasen
const db = new sql.Database('./db/moment1.db');

//Skapa tabell för kurser: ID, kurskod, kursnamn, progression och kursplan (url)
db.serialize(() => {
    //Droppa om den finns först
    db.run('DROP TABLE IF EXISTS courses;');
    //Lägg till kurstabell annars
    db.run(`CREATE TABLE courses(
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        code TEXT NOT NULL, 
        name TEXT NOT NULL, 
        progression TEXT,
        syllabus TEXT, 
        -- validera url 
        CHECK (syllabus LIKE "http%://%") 
    )`);
});

db.close();
