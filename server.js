//Importera saker
const express = require('express');
const sql = require('sqlite3').verbose();
require('dotenv').config();

//anslut till databasen
const db = new sql.Database('./db/moment1.db');

//Settings
const port = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//Routing för startsidan
app.get('/', (req, res) => {
    //Läs in befintliga kursobjekt
    db.all('SELECT * FROM courses;', (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.render('index', { error: '', rows: rows });
    });
});

//Lägg till kurs-sida
app.get('/add', (req, res) => {
    res.render('add', { error: '' });
});

//Lägg till kurs
app.post('/add', (req, res) => {
    //Lagra kolumnerna i variabler
    let coursecode = req.body.coursecode;
    let coursename = req.body.coursename;
    let progression = req.body.progression;
    let syllabus = req.body.syllabus;
    //Tomt error ifall ifall
    let error = '';
    //Kontrollera att inte raderna är tomma innan de läggs till
    if (coursecode !== '' && coursename !== '' && progression !== '' && syllabus !== '') {
        //Enklare validering
        if (syllabus.includes('http')) {
            //Peta in i databasen om allt är bra
            const stmt = db.prepare(
                `INSERT INTO courses(code, name, progression, syllabus)VALUES(?, ?, ?, ?);`
            );
            stmt.run(coursecode, coursename, progression, syllabus);
            stmt.finalize();
            //Om allt går bra, omdirigera till startsida
            res.redirect('/');
        } else {
            //annars, skriv errormeddelande
            error = 'Du måste ange en giltig url';
            res.render('add', {
                error: error,
            });
        }
        //Om ingen validering så skriv ut error
    } else {
        error = 'Du måste fylla i samtliga fält';
        res.render('add', {
            error: error,
        });
    }
});

//Ta bort kurser
app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    //Radera
    db.run('DELETE FROM courses WHERE id=?;', id, (err) => {
        if (err) {
            console.error(err.message);
        }
        //Omdirigera
        res.redirect('/');
    });
});

//starta applikation på port
app.listen(port, () => {
    console.log('Server startad på port ' + port);
});
