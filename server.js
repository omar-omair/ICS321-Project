const pg = require('pg');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db.js');
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static("public"));

app.use(bodyParser.json());

app.get('/', async (req, res) => {
    try {
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM flights", (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        res.json(response);
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'log.html'));
})

app.get("/booking", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'booking.html'));
})

app.post("/login/accounts", async function (req, res) {
    try {
        const { email, password } = req.body;
        const response = await new Promise((resolve, reject) => {
            db.query("SELECT email, password FROM passenger", (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.rows);
                }
            });
        });

        const user = response.find(element => email === element.email && password === element.password);
        if (user) {
            res.status(200).send("OK"); // Send user data back if found
        } else {
            res.status(404).send('Not Found'); // Send 404 if user not found
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

