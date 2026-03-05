const express = require('express');
const User = require('../models/user.model');

const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Hello from Test');
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ id: 1 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({
            error: 'Failed to fetch users',
            details: err.message
        });
    }
});

module.exports = router;
