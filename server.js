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
    res.redirect("/booking");
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'log.html'));
})

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
})


app.get("/booking", function (req, res) {
    //var storedData = localStorage.getItem('user');
    if (true) {
        res.sendFile(path.join(__dirname, 'public', 'booking.html'));
    }
    else {
        res.redirect("/login")
    }
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
            res.status(200).send(email); // Send user data back if found
        } else {
            res.status(404).send('Not Found'); // Send 404 if user not found
        }
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.post("/register/accounts", async function (req, res) {
    try {
        let pid = 99;
        let user_type = "user";
        const { name, email, password, phone, address } = req.body;
        db.query(`INSERT INTO passenger VALUES(${pid}, '${name}', '${phone}', '${email}', '${address}', '${user_type}', '${password}')`, (err, result) => {
            if (err) {
                console.error('Error executing query:', err);
            }
        });

        res.status(200).send(email);


    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

