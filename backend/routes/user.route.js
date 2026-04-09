const express = require('express');
const User = require('../models/user.model');
const auth = require('../middleware/auth');
const router = express.Router();

// READ all items
router.get('/', auth, async (req, res) => {
    try {
        const entries = await User.find({ owner: req.user.userId })
            .sort({ createdAt: -1 });
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch entries', details: err.message });
    }
});

// READ one item
router.get('/:id', auth, async (req, res) => {
    try {
        const entry = await User.findOne({
             _id: req.params.id,
            owner: req.user.userId});
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(entry);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch entry', details: err.message });
    }
});

// CREATE one item
router.post('/', auth, async (req, res) => {
    try {
        const entry = await User.create({
            ...req.body,
            owner: req.user.userId
        });
        res.status(201).json(entry);
    } catch (err) {
        res.status(400).json({ error: 'Failed to create entry', details: err.message });
    }
});

// UPDATE one item
router.put('/:id', auth, async (req, res) => {
    try {
        const entry = await User.findOneAndUpdate(
          { _id: req.params.id, owner: req.user.userId },
          req.body,
          { runValidators: true, returnDocument: 'after' });
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(200).json(entry);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update entry', details: err.message });
    }
});

// DELETE one item
router.delete('/:id', auth, async (req, res) => {
    try {
        const entry = await User.findOneAndDelete({
            _id: req.params.id,
            owner: req.user.userId});
        if (!entry) return res.status(404).json({ error: 'Entry not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete entry', details: err.message });
    }
});

module.exports = router;
