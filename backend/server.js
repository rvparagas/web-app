// CPS630 A2 - MERN-style backend: Express + MongoDB (Mongoose)
// Serves REST API (CRUD notes) and static frontend. Starts on port 8080.

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Note = require('./models/note.model');
const noteRoute = require('./routes/note.route');

const PORT = 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/webapp';

// Seed test data if the notes collection is empty (e.g. first run or new DB)
async function seedNotesIfEmpty() {
  const count = await Note.countDocuments();
  if (count === 0) {
    console.log('Notes collection empty. Seeding test data...');
    await Note.insertMany([
      { note: 'First seeded note' },
      { note: 'Second seeded note' },
      { note: 'Third seeded note' },
    ]);
    console.log('Seeded 3 test notes.');
  } else {
    console.log('Notes already exist. Skipping seed.');
  }
}

const app = express();

app.use(express.json());

// Static assets and views from frontend (folder name is "frontend", not "front-end")
app.use('/', express.static(path.join(__dirname, '../frontend/public')));

// REST API: full CRUD for notes (MongoDB)
app.use('/api/notes', noteRoute);

// HTML routes (3 pages)
const viewsDir = path.join(__dirname, '../frontend/views');
app.get('/', (req, res) => {
  res.sendFile(path.join(viewsDir, 'index.html'));
});
app.get('/notes', (req, res) => {
  res.sendFile(path.join(viewsDir, 'notes.html'));
});
app.get('/about', (req, res) => {
  res.sendFile(path.join(viewsDir, 'about.html'));
});

// 404: JSON for unknown API routes, HTML for unknown page routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.type('application/json').status(404).json({
      error: 'Not found',
      message: `Cannot ${req.method} ${req.path}`,
    });
  }
  res.status(404).sendFile(path.join(viewsDir, '404.html'));
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB at', mongoose.connection.host);
    await seedNotesIfEmpty();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
  app.listen(PORT, () => console.log('Server started on http://localhost:' + PORT));
}

start();
