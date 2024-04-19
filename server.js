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
app.use(express.static('public/'));
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

    /* VALIDERING */
    //Error-objekt
    const errorMessage = {
        codeError: 'Du måste ange kurskod!',
        nameError: 'Du måste ange kursnamn!',
        progError: 'Du måste ange progression A eller B!',
        syllEmpty: 'Du måste ange länk till kursplan!',
        syllError: 'Du måste ange giltig url med http/https!',
    };

    //Kontroller som tilldelar error värde baserat på fälten
    if (!coursecode) {
        error = errorMessage.codeError;
    } else if (!coursename) {
        error = errorMessage.nameError;
    } else if (!progression) {
        error = errorMessage.progError;
    } else if (!progression === 'A' || !progression === 'B') {
        error = errorMessage.progError;
    } else if (!syllabus) {
        error = errorMessage.syllEmpty;
    } else if (!syllabus.includes('http')) {
        error = errorMessage.syllError;
    }

    //Om error finns, rendera om sidan med felmeddelande
    if (error) {
        res.render('add', { error: error });
    } else {
        //Om validering godkänd, lägg till i databas
        const stmt = db.prepare(
            `INSERT INTO courses(code, name, progression, syllabus) VALUES (?, ?, ?, ?);`
        );
        stmt.run(coursecode, coursename, progression, syllabus);
        stmt.finalize();
        //Omdirigera till start
        res.redirect('/');
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

//Redigera kurser: läs in kurs
app.get('/edit/:id', (req, res) => {
    //Hämta id på kursen
    const id = req.params.id;
    //Välj ut den
    db.get('SELECT * FROM courses where id=?', id, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        //Skicka kursen till edit-sidan
        res.render('edit', {
            row: row,
            error: '',
        });
    });
});

//Uppdatera kurs
app.post('/edit/:id', (req, res) => {
    //Hämta id
    const id = req.params.id;
    //Lagra värdena
    let coursecode = req.body.coursecode;
    let coursename = req.body.coursename;
    let progression = req.body.progression;
    let syllabus = req.body.syllabus;
    let error = '';

    /* VALIDERING */
    //Error-objekt
    const errorMessage = {
        codeError: 'Du måste ange kurskod!',
        nameError: 'Du måste ange kursnamn!',
        progError: 'Du måste ange progression A eller B!',
        syllEmpty: 'Du måste ange länk till kursplan!',
        syllError: 'Du måste ange giltig url med http/https!',
    };

    //Kontroller som tilldelar error värde baserat på fälten
    if (!coursecode) {
        error = errorMessage.codeError;
    } else if (!coursename) {
        error = errorMessage.nameError;
    } else if (!progression) {
        error = errorMessage.progError;
    } else if (!progression === 'A' || !progression === 'B') {
        error = errorMessage.progError;
    } else if (!syllabus) {
        error = errorMessage.syllEmpty;
    } else if (!syllabus.includes('http')) {
        error = errorMessage.syllError;
    }

    //Om error finns, rendera om sidan med felmeddelande
    if (error) {
        db.get(`SELECT * FROM courses WHERE id=?`, id, (err, row) => {
            if (err) {
                console.log(err.message);
            }
            res.render('edit', { error: error, row: row });
        });
    } else {
        //Om validering godkänd, uppdatera databas
        const stmt = db.prepare(
            `UPDATE courses SET code=?, name=?, progression=?, syllabus=? WHERE id=?;`
        );
        stmt.run(coursecode, coursename, progression, syllabus, id);
        stmt.finalize();
        //Omdirigera till start
        res.redirect('/');
    }
});

//Om sidan
app.get('/about', (req, res) => {
    res.render('about');
});

//starta applikation på port
app.listen(port, () => {
    console.log('Server startad på port ' + port);
});
