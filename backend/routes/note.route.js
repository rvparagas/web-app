const express = require('express');
const Note = require('../models/note.model');

const router = express.Router();

// READ multiple items — GET /api/notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }).lean();
    const payload = notes.map((n) => ({
      id: n._id.toString(),
      note: n.note,
    }));
    res.type('application/json').status(200).json(payload);
  } catch (err) {
    res.type('application/json').status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

// READ one item — GET /api/notes/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.type('application/json').status(400).json({
      error: 'Bad request',
      message: 'Invalid note id.',
    });
  }
  try {
    const note = await Note.findById(id).lean();
    if (!note) {
      return res.type('application/json').status(404).json({
        error: 'Not found',
        message: `Note with id ${id} not found.`,
      });
    }
    res.type('application/json').status(200).json({
      id: note._id.toString(),
      note: note.note,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.type('application/json').status(400).json({
        error: 'Bad request',
        message: 'Invalid note id.',
      });
    }
    res.type('application/json').status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

// CREATE an item — POST /api/notes
router.post('/', async (req, res) => {
  const text = req.body?.note;
  if (text === undefined || typeof text !== 'string' || !text.trim()) {
    return res.type('application/json').status(400).json({
      error: 'Bad request',
      message: 'Body must include a non-empty "note" string.',
    });
  }
  try {
    const newNote = new Note({ note: text.trim() });
    await newNote.save();
    res.type('application/json').status(201).json({
      id: newNote._id.toString(),
      note: newNote.note,
    });
  } catch (err) {
    res.type('application/json').status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

// UPDATE an item — PUT /api/notes/:id
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const text = req.body?.note;
  if (text === undefined || typeof text !== 'string' || !text.trim()) {
    return res.type('application/json').status(400).json({
      error: 'Bad request',
      message: 'Body must include a non-empty "note" string.',
    });
  }
  try {
    const note = await Note.findByIdAndUpdate(
      id,
      { note: text.trim() },
      { new: true, runValidators: true }
    ).lean();
    if (!note) {
      return res.type('application/json').status(404).json({
        error: 'Not found',
        message: `Note with id ${id} not found.`,
      });
    }
    res.type('application/json').status(200).json({
      id: note._id.toString(),
      note: note.note,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.type('application/json').status(400).json({
        error: 'Bad request',
        message: 'Invalid note id.',
      });
    }
    res.type('application/json').status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

// DELETE an item — DELETE /api/notes/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Note.findByIdAndDelete(id);
    if (!result) {
      return res.type('application/json').status(404).json({
        error: 'Not found',
        message: `Note with id ${id} not found.`,
      });
    }
    res.status(204).send();
  } catch (err) {
    if (err.name === 'CastError') {
      return res.type('application/json').status(400).json({
        error: 'Bad request',
        message: 'Invalid note id.',
      });
    }
    res.type('application/json').status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

module.exports = router;
