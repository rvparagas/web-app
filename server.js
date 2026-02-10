// Server initialization
const express = require('express');
const app = express();
const path = require('path');

// JSON file containing seed data - will be changed to a database in future assignments
const db = require("./database.json");

const PORT = 8080;

app.use('/', express.static(path.join(__dirname, '/public')));

// Server paths
// Skeleton pages - intended to be updated/replaced
app.get('/', (req, res) => {
    res.send(`<h1>${db.note[0].note}</h1>`);
    // res.sendFile(path.join(__dirname, '/views/PLACEHOLDER.html'))
});

app.get('/page2', (req, res) => {
    res.send("<h1>Page 2</h1>")
});

app.get('/page3', (req, res) => {
    res.send("<h1>Page 3</h1>")
});

// Starts server
app.listen(PORT, () => console.log("Server started on port: " + PORT));