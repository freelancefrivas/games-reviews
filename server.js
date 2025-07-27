const express = require('express');
const pool = require('./db');
const port = 3000;

const app = express();


app.post('/', async (req, res) => {
    const {firstName, lastName, password, nickname, email, admin} = req.body;
    try {
        await pool.query('INSERT INTO users (first_name, last_name, password, nickname, email,admin) VALUES ($1, $2, $3)', [firstName, lastName, password, nickname, email, admin]);
        res.status(200).send({message: "Successfully added user"});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/', async (req, res) => {
    try {
        const data = await pool.query('SELECT * FROM users');
        res.status(200).send({children: data.rows});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.get('/setup', async (req, res) => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, first_name VARCHAR(100) NOT NULL,last_name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(120), nickname VARCHAR(120), admin BOOLEAN DEFAULT false);');
        res.status(200).send({message: "Successfully created database"});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


app.listen(port, () => {
    console.log(`Sever has started on port ${port}`);
});