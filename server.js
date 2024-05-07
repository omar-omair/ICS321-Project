const pg = require('pg');
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./db.js');

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

db.query("SELECT * FROM flights", function (err, res) {
    if (err) {
        console.log(err.stack);
    }
    console.log(res.rows);
})