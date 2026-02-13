// CPS630 A1 - Multi-page Web Application
// server.js: Express server, static files, HTML routes, REST API (notes in database.json)

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const DB_PATH = path.join(__dirname, 'database.json');

// Parse JSON request bodies (for POST)
app.use(express.json());

// Serve static assets from public/
app.use('/', express.static(path.join(__dirname, 'public')));

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
const viewsDir = path.join(__dirname, 'views');

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

// Start server
app.listen(PORT, () => console.log('Server started on port ' + PORT));
