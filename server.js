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

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port, () => {
    console.log('Server startad på port ' + port);
});
