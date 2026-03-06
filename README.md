# Multi-page Web Application (A2 – MongoDB branch)

## Overview

This is a notes app for CPS630 A2. Users can view a list of notes, add new ones, update them, and delete them. The app uses a **Node.js + Express** backend connected to **MongoDB** (Mongoose), with three HTML pages (Home, Notes, About) and a REST API. Data is stored in MongoDB. On first run, if the notes collection is empty, the server seeds three test notes. In the future this could be extended with a React+Vite front end (e.g. on the `frontend` branch), auth, or more CRUD resources.

## Documentation

### How to run the project

1. **MongoDB** must be running (local: `mongodb://localhost:27017` or set `MONGODB_URI` for Atlas).
2. From the **backend** folder:
   - `npm install`
   - `npm run start` (or `npm start`)
3. Or from the **project root**: `npm run start` (runs the backend).
4. Open a browser at: **http://localhost:8080**

### How to use it

- **Home** (`/`) – intro and links to other pages.
- **Notes** (`/notes`) – view all notes, add a note, view a single note, delete a note.
- **About** (`/about`) – short description of the project.

### REST API (CRUD)

| Method | Route | Description | Status codes |
|--------|--------|-------------|--------------|
| GET | `/api/notes` | Read multiple notes | 200, 500 |
| GET | `/api/notes/:id` | Read one note | 200, 400, 404, 500 |
| POST | `/api/notes` | Create a note; body `{ "note": "text" }` | 201, 400, 500 |
| PUT | `/api/notes/:id` | Update a note; body `{ "note": "text" }` | 200, 400, 404, 500 |
| DELETE | `/api/notes/:id` | Delete a note | 204, 400, 404, 500 |

Responses use JSON. Unknown API routes return 404 JSON; unknown page routes serve the 404 HTML page.

### Project structure (MongoDB branch)

- **backend/** – Express server, Mongoose models, routes. Runs on port 8080.
- **frontend/** – Static HTML, CSS, JS (and optionally a React app under `frontend/src`).
- **package.json** (root) – `npm run start` runs the backend.

### Frontend branch and React (A2)

A2 requires **at least 3 React+Vite views** and the front end to start with **`npm run dev`** on **http://localhost:5173**. That work lives on the **`frontend`** branch (e.g. React app in this repo or in a separate `frontend` folder). This (MongoDB) branch provides the backend and API only; the current `frontend/` here is static HTML/JS.

**Running backend and React dev server together**

1. **Terminal 1 – backend (port 8080)**  
   - Start MongoDB, then from the project root: `npm run start`  
   - Or from `backend/`: `npm install` then `npm run start`  
   - API base: **http://localhost:8080** (e.g. `http://localhost:8080/api/notes`).

2. **Terminal 2 – React dev server (port 5173)**  
   - Check out or open the frontend (React) app (e.g. from the `frontend` branch or `frontend/` if it’s a Vite app).  
   - From that app’s folder: `npm install` then `npm run dev`.  
   - Open **http://localhost:5173** in the browser.

3. **Connecting React to the API**  
   - In the React app, call the backend with full URLs: `http://localhost:8080/api/notes` (or set `VITE_API_URL=http://localhost:8080` and use that in fetch/axios).  
   - If the React app is served by Vite on 5173, same-origin does not apply to 8080; either use the full URL or configure Vite proxy to forward `/api` to `http://localhost:8080`.

## Reflection

This branch adds MongoDB to the app: the backend connects to MongoDB on startup, seeds test notes if the collection is empty, and implements full CRUD for notes (create, read one, read many, update, delete) with appropriate HTTP methods and status codes. The frontend path was corrected from `front-end` to `frontend`. Challenges included wiring async startup (connect then seed then listen) and keeping the API response shape so the existing notes UI still works. The backend is modular (separate model and route files for notes).
