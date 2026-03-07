# Multi-page Web Application (A2 – MongoDB)

## Overview

This is a notes app for CPS630 A2. The app uses a **Node.js + Express** backend connected to **MongoDB** (Mongoose) with a REST API for CRUD operations. Data is stored in MongoDB. On first run, if the collection is empty, the server seeds notes from `backend/data.json`. In the future, more pages could be added using the React framework, as well as re-adding a search function (as seen in A1) and other granular sorting functions.

## Documentation

### How to run the project

1. **MongoDB** must be running and connected to (local: `mongodb://localhost:27017`).
2. From the **backend** folder:
   - `npm install`
   - `npm run start` (or `npm start`)
3. Or from the **project root**: `npm run start` (runs the backend).
4. From the **frontend** folder:
   - `npm install`
   - `npm run dev` (or `npm dev`)
5. Open a browser at: **http://localhost:5173**

### How to use it

- **Home** (`/`) – intro and links to other pages.
- **Entries** (`/entries`) – view all notes, add a note, view a single note, delete a note, sort by tags.
- **Detail** (`/entries/:id`) – detailed view of an entry.

### REST API (CRUD)

| Method | Endpoint | Description | Status codes |
|--------|----------|-------------|--------------|
| GET | `/api/user` | Read all entries | 200, 500 |
| GET | `/api/user/:id` | Read one entry | 200, 404, 500 |
| POST | `/api/user` | Create entry | 201, 400 |
| PUT | `/api/user/:id` | Update entry | 200, 400, 404 |
| DELETE | `/api/user/:id` | Delete entry | 204, 404, 500 |


Sample body for POST/PUT:
`{ "passage": "Quote text", "source": "Book/Author", "commentary": "Optional note", "tag": "optional-tag" }`

API endpoints return JSON responses.

### Project structure (MongoDB branch)

- **backend/** – Express server, Mongoose models, routes. Runs on port 8080.
- **frontend/** – Static HTML, CSS, JS (and optionally a React app under `frontend/src`). Runs on port 5173.
- **package.json** (root) – `npm run start` runs the backend.

### Frontend branch and React (A2)

A2 requires **at least three React + Vite views** and the front end to start with **`npm run dev`** on **http://localhost:5173**.

## Reflection

This branch adds MongoDB to the app: the backend connects to MongoDB on startup, seeds data if the collection is empty, and implements full CRUD (create, read one, read many, update, delete) with appropriate HTTP methods and status codes under `/api/user`. The backend is modular (separate model and route files). Very little challenges were faced when expanding on this project; the main one being our web app not wanting to connect to MongoDB during development due to changes on separate branches, which was later fixed.
