# Notes - A Commonplace Book Web Application (A3 – Final Submission)

## Overview

**Notes** is a full-stack MERN web application that serves as a digital commonplace book—a place to collect passages, quotes, and reflections worth keeping. The application demonstrates modern web development practices including:

- **MERN Stack**: React frontend, Node.js + Express backend, MongoDB database
- **REST API**: Full CRUD operations with proper HTTP methods and status codes
- **JWT Authentication**: Secure user registration and login with per-user data isolation
- **Real-time Communication**: Socket.io integration for live activity feeds and typing indicators
- **Responsive Design**: Mobile-friendly UI following Nielsen usability principles

### Key Features

- **Multi-user Support**: Each user has their own private collection of notes
- **Real-time Activity Feed**: See when other users join, leave, or modify entries
- **Typing Indicators**: Know when someone is actively writing
- **Tag-based Organization**: Filter entries by custom tags
- **Random Entry Discovery**: Serendipitous browsing of your collection
- **Inline Editing**: Quick edits without leaving the list view

## Documentation

### Prerequisites

- Node.js (v18+)
- MongoDB running locally on port 27017
- npm or yarn

### How to Run the Project

1. **Start MongoDB** (must be running on `mongodb://localhost:27017`)

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend folder:
   ```
   JWT_SECRET=your-secret-key-here
   ```
   
   Start the server:
   ```bash
   npm run start    # Production
   npm run dev      # Development with nodemon
   ```
   Backend runs on **http://localhost:8080**

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend runs on **http://localhost:5173**

4. **Open** http://localhost:5173 in your browser

### How to Use It

1. **Register**: Create an account with email and password
2. **Login**: Sign in to access your notes
3. **Create Entries**: Click "+ New Entry" to add passages with source, commentary, and tags
4. **Browse**: View all entries, filter by tags, or get a random entry
5. **Edit/Delete**: Use inline editing or the detail view to modify entries
6. **Real-time**: Watch the activity feed (right sidebar) to see live updates

### REST API Endpoints

#### Authentication (`/api/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ email, password }` |
| POST | `/api/auth/login` | Login user | `{ email, password }` |

Login returns a JWT token to use in subsequent requests.

#### Entries (`/api/user`) - All routes require `Authorization: Bearer <token>`

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| GET | `/api/user` | Get all user's entries | 200, 401, 500 |
| GET | `/api/user/:id` | Get single entry | 200, 401, 404, 500 |
| POST | `/api/user` | Create entry | 201, 400, 401 |
| PUT | `/api/user/:id` | Update entry | 200, 400, 401, 404 |
| DELETE | `/api/user/:id` | Delete entry | 204, 401, 404, 500 |

**Sample Entry Body**:
```json
{
  "passage": "Quote or passage text",
  "source": "Book/Author/Source",
  "commentary": "Your thoughts (optional)",
  "tag": "category (optional)"
}
```

### Socket.io Events

The application uses Socket.io for real-time features:

| Event | Direction | Description |
|-------|-----------|-------------|
| `user:join` | Client → Server | User connects with their info |
| `users:online` | Server → Client | List of currently online users |
| `activity:new` | Server → Client | New activity (create/update/delete/join/leave) |
| `entry:typing` | Bidirectional | Typing indicator status |
| `entry:created` | Server → Client | New entry was created |
| `entry:updated` | Server → Client | Entry was modified |
| `entry:deleted` | Server → Client | Entry was removed |

### Project Structure

```
web-app/
├── backend/
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── models/
│   │   ├── authUser.model.js # User credentials schema
│   │   └── user.model.js     # Entry/note schema
│   ├── routes/
│   │   ├── auth.route.js     # Register/login endpoints
│   │   └── user.route.js     # CRUD endpoints for entries
│   ├── server.js             # Express + Socket.io server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityFeed.jsx  # Real-time activity sidebar
│   │   │   ├── EntryCard.jsx     # Entry display/edit component
│   │   │   └── Navbar.jsx        # Navigation with auth state
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state management
│   │   │   └── SocketContext.jsx # Socket.io connection management
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Entries.jsx       # Entry list with CRUD
│   │   │   ├── Detail.jsx        # Single entry view
│   │   │   ├── Login.jsx         # Login form
│   │   │   └── Register.jsx      # Registration form
│   │   ├── App.jsx               # Routes and providers
│   │   └── main.jsx              # React entry point
│   └── package.json
└── README.md
```

## Reflection

### What We Built

For A3, we extended our A2 MERN notes application with:

1. **Complete Authentication System**: JWT-based auth with bcrypt password hashing, protected routes on both frontend and backend, and per-user data isolation.

2. **Real-time Communication via Socket.io**: 
   - Live activity feed showing user joins/leaves and entry modifications
   - Typing indicators when users are composing entries
   - Automatic UI updates when entries change (no manual refresh needed)
   - Online user presence tracking

3. **Enhanced User Experience**:
   - Protected routes redirect unauthenticated users to login
   - Persistent sessions via localStorage
   - Responsive design for mobile devices
   - Smooth transitions and hover effects

### Creative Features

- **Live Activity Feed**: A sidebar showing real-time activity across the platform—when users join, leave, or modify entries. This goes beyond basic Socket.io requirements by creating a social, collaborative feel.

- **Typing Indicators**: Users can see when others are actively writing, similar to modern chat applications.

- **Random Entry Feature**: A "serendipity" button that surfaces random entries from your collection, encouraging rediscovery of forgotten notes.

### Challenges

- **Socket.io + Authentication Integration**: Ensuring Socket.io events properly identified users required careful coordination between the auth context and socket connection lifecycle.

- **Real-time State Synchronization**: Keeping the React state in sync with Socket.io events while avoiding duplicate updates required thoughtful event handling.

- **CORS Configuration**: Getting the frontend, backend, and Socket.io to communicate properly across different ports required careful CORS setup.

### Successes

- Clean separation of concerns with React Context for auth and socket state
- Modular backend with separate route files and middleware
- Real-time features that enhance rather than complicate the user experience
- Consistent UI/UX following Nielsen's usability heuristics (visibility of system status, user control, consistency)

### Technologies Used

- **Frontend**: React 19, React Router 7, Vite 7, Socket.io-client
- **Backend**: Node.js, Express 5, Mongoose 9, Socket.io, JWT, bcrypt
- **Database**: MongoDB
- **Development**: nodemon, ESLint
