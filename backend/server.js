// CPS630 A1 - Multi-page Web Application
// server.js: Express server, static files, HTML routes, REST API (notes in database.json)

const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DB_PATH = path.join(__dirname, 'database.json');
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route');
const User = require('./models/user.model');

const DB_PORT = '27017';
const DB_HOST = 'localhost';
const DB_NAME = 'usernotes';


const testUsers = [
    { passage: 'Quotation 1', source: 'Source 1 ', commentary: 'Commentary 1', tag: 'tag1' },
    { passage: 'Quotation 2', source: 'Source 2 ', commentary: 'Commentary 2', tag: 'tag2' },
    { passage: 'Quotation 3', source: 'Source 3 ', commentary: 'Commentary 3', tag: 'tag3' },

];

async function start()
{
    try{
        await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        console.log('MongoDB connected');
    }
    catch (err){
        console.error('MongoDB connection failed: ', err.message);
        process.exit(1);
    }
};

start();


//Added Test Users To Check To see if Connected To MongoDB 
async function addTestUsersToMongoDB() {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
        console.log('Adding test users to MongoDB...');
        await User.insertMany(testUsers);
        console.log('Seeded users:', testUsers.length);
        return;
    }

    console.log('Users already exist. Skipping seed.');
}

const app = express();

const cors = require('cors')
app.use(cors())

// Start server
app.listen(PORT, () => console.log('Server started on port ' + PORT));

// Parse JSON request bodies (for POST)
app.use(express.json());

//Testing
app.use("/api/user", userRoute)

// Serve static assets from front-end/public/
app.use('/', express.static(path.join(__dirname, '../front-end/public')));

// --- Database helpers (read/write JSON file) ---
function readDb() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading database:', err.message);
        return { notes: [] };
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4), 'utf8');
        return true;
    } catch (err) {
        console.error('Error writing database:', err.message);
        return false;
    }
}

// --- REST API ---

// GET /api/notes — return the full list of notes
app.get('/api/notes', (req, res) => {
    const db = readDb();
    res.type('application/json').status(200).json(db.notes);
});

// GET /api/notes/:id — return a single note by id
app.get('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        return res.type('application/json').status(400).json({
            error: 'Bad request',
            message: 'Invalid note id.'
        });
    }
    const db = readDb();
    const note = db.notes.find((n) => n.id === id);
    if (!note) {
        return res.type('application/json').status(404).json({
            error: 'Not found',
            message: `Note with id ${id} not found.`
        });
    }
    res.type('application/json').status(200).json(note);
});

// POST /api/notes — add a new note (body: { note: "string" })
app.post('/api/notes', (req, res) => {
    const text = req.body?.note;
    if (text === undefined || typeof text !== 'string' || !text.trim()) {
        return res.type('application/json').status(400).json({
            error: 'Bad request',
            message: 'Body must include a non-empty "note" string.'
        });
    }
    const db = readDb();
    const maxId = db.notes.length
        ? Math.max(...db.notes.map((n) => n.id))
        : 0;
    const newNote = { id: maxId + 1, note: text.trim() };
    db.notes.push(newNote);
    if (!writeDb(db)) {
        return res.type('application/json').status(500).json({
            error: 'Internal server error',
            message: 'Failed to save note.'
        });
    }
    res.type('application/json').status(201).json(newNote);
});

// DELETE /api/notes/:id — delete a note by id
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        return res.type('application/json').status(400).json({
            error: 'Bad request',
            message: 'Invalid note id.'
        });
    }
    const db = readDb();
    const index = db.notes.findIndex((n) => n.id === id);
    if (index === -1) {
        return res.type('application/json').status(404).json({
            error: 'Not found',
            message: `Note with id ${id} not found.`
        });
    }
    db.notes.splice(index, 1);
    if (!writeDb(db)) {
        return res.type('application/json').status(500).json({
            error: 'Internal server error',
            message: 'Failed to delete note.'
        });
    }
    res.status(204).send();
});

// --- HTML routes (3 pages with shared layout via static CSS) ---
const viewsDir = path.join(__dirname, '../front-end/views');

app.get('/', (req, res) => {
    res.sendFile(path.join(viewsDir, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(viewsDir, 'notes.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(viewsDir, 'about.html'));
});

// 404 — serve HTML page for unknown page routes, JSON for unknown API routes
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.type('application/json').status(404).json({
            error: 'Not found',
            message: `Cannot ${req.method} ${req.path}`
        });
    }
    res.status(404).sendFile(path.join(viewsDir, '404.html'));
});