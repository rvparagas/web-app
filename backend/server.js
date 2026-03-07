const express = require('express');
const cors = require('cors')
const app = express();

// Import Mongo database
const mongoose = require('mongoose');
const userRoute = require('./routes/user.route');

const PORT = 8080;
const User = require('./models/user.model');

const DB_PORT = '27017';
const DB_HOST = 'localhost';
const DB_NAME = 'usernotes';

// Connect to database
async function start()
{
    try {
        await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
        console.log('MongoDB connected.');
    }
    catch (err) {
        console.error('MongoDB connection failed: ', err.message);
        process.exit(1);
    }
};
start();

// Import notes from data.json
const userNotes = require('./data.json');

// Add notes to database, if not added already
async function addNotesToMongoDB() {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
        console.log('Adding seed notes to MongoDB...');
        await User.insertMany(userNotes);
        console.log('Seeded notes:', userNotes.length);
        return;
    }

    console.log('Users already exist; skipping seed.');
}
addNotesToMongoDB();

// Enable CORS for frontend requests
app.use(cors());

// Start server
app.listen(PORT, () => console.log('Server started on port', PORT));

// Parse JSON request bodies (for POST)
app.use(express.json());

// Testing
app.use("/api/user", userRoute)