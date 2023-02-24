const express = require('express');
var cors = require('cors');
const app = express();
const mysql = require('mysql');
const port = 4000;
const dbConnParam = {host: 'localhost', user: 'root', database: 'Forza4'};

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.get('/', (req, res) => {
    console.log('Root response')
    res.send('Wellcome in peer service');
});

app.get('/peers', (req, res) => {
    const dbConn = mysql.createConnection(dbConnParam);
    const queryStr = 'SELECT * FROM Peer LIMIT 10';

    console.log('Peers request');
    dbConn.query(queryStr, (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500); // internal server error
            res.end();
            return;
        }
        res.status(200).json(rows);
    });
});

app.get('/peer/:Username', (req, res) => {
    const dbConn = mysql.createConnection(dbConnParam);
    const queryStr = 'SELECT * FROM Peer WHERE Username = ?';

    console.log('Particular peer request');
    dbConn.query(queryStr, [req.params.Username], (err, rows, fields) => {
        if (err) {
            console.log(err);
            res.sendStatus(500); // internal server error
            res.end();
            return;
        }
        if (rows.length == 0)
            res.sendStatus(404); // not found
        else
            res.status(200).json(rows[0]);
    });
});

app.post('/newPeer', (req, res) => {
    const dbConn = mysql.createConnection(dbConnParam);
    const queryStr = 'INSERT INTO Peer VALUES (?,?)';

    console.log('New peer request');
    dbConn.query(queryStr, [req.body.Username, req.body.PswHash], (err, result) => {
        if (err) {
            console.log(err.code);
            res.sendStatus(err.code == 'ER_DUP_ENTRY' ? 400 : 500); // bad request (duplicate key) OR internal server error
            res.end();
            return;
        }
        if (result.affectedRows == 1) {
            res.status(201); // resource created
            res.location('/peer/' + req.body.Username);
            res.send();
        }
        else
            res.sendStatus(500);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`))
