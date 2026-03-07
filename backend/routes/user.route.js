const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// READ all items
router.get('/', async (req, res) => {
    try {
        const entries = await User.find().sort({ createdAt: -1 });
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch entries', details: err.message });
    }
});

// READ one item
router.get('/:id', async (req, res) => {
    try {
        const entry = await User.findById(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch entry', details: err.message });
    }
});

// CREATE one item
router.post('/', async (req, res) => {
    try {
        const entry = await User.create(req.body);
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create entry', details: err.message });
    }
});

// UPDATE one item
router.put('/:id', async (req, res) => {
    try {
        const entry = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, returnDocument: 'after' });
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(entry);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update entry', details: err.message });
    }
});

// DELETE one item
router.delete('/:id', async (req, res) => {
    try {
        const entry = await User.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete entry', details: err.message });
    }
});

module.exports = router;
