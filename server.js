const pg = require('pg');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db.js');

app.use(express.static("public"));

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


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

