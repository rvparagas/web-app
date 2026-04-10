require('dotenv').config()

const express = require('express');
const cors = require('cors')
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Import Mongo database
const mongoose = require('mongoose');
const userRoute = require('./routes/note.route');
const authRoute = require('./routes/auth.route');

const PORT = 8080;

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

// Note: Seed data removed as entries now require an authenticated owner.
// Users create their own entries after registering.

// Enable CORS for frontend requests
app.use(cors());

// Parse JSON request bodies (for POST)
app.use(express.json());

// Make io accessible to routes
app.set('io', io);

// Socket.io connection handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('user:join', (userData) => {
        onlineUsers.set(socket.id, userData);
        io.emit('users:online', Array.from(onlineUsers.values()));
        io.emit('activity:new', {
            type: 'join',
            user: userData.email,
            message: `${userData.email} joined`,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('entry:typing', (data) => {
        socket.broadcast.emit('entry:typing', {
            user: data.user,
            isTyping: data.isTyping
        });
    });

    socket.on('disconnect', () => {
        const userData = onlineUsers.get(socket.id);
        if (userData) {
            io.emit('activity:new', {
                type: 'leave',
                user: userData.email,
                message: `${userData.email} left`,
                timestamp: new Date().toISOString()
            });
        }
        onlineUsers.delete(socket.id);
        io.emit('users:online', Array.from(onlineUsers.values()));
        console.log('User disconnected:', socket.id);
    });
});

// Routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Start server with Socket.io
server.listen(PORT, () => console.log('Server started on port', PORT));

