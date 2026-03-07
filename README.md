# Multi-page Web Application (A2 – MongoDB branch)

## Overview

This is a notes app for CPS630 A2. The app uses a **Node.js + Express** backend connected to **MongoDB** (Mongoose) with a REST API for CRUD operations. Data is stored in MongoDB. On first run, if the collection is empty, the server seeds notes from `backend/data.json`.

## Documentation

### How to run the project

1. **MongoDB** must be running (local: `mongodb://localhost:27017` or set `MONGODB_URI` for Atlas).
2. From the **backend** folder:
   - `npm install`
   - `npm run start` (or `npm start`)
3. Or from the **project root**: `npm run start` (runs the backend).
4. Backend runs at: **http://localhost:8080**

### How to use it

- Use API routes from a client (React app, Postman, Thunder Client, or curl).
- Main base URL: `http://localhost:8080`

### REST API (CRUD)

| Method | Description | Status codes |
|--------|--------|-------------|--------------|
| GET | `/api/user` (read all entries) | 200, 500 |
| GET | `/api/user/:id` (read one entry) | 200, 404, 500 |
| POST | `/api/user` (create entry) | 201, 400 |
| PUT | `/api/user/:id` (update entry) | 200, 400, 404 |
| DELETE | `/api/user/:id` (delete entry) | 204, 404, 500 |

Sample body for POST/PUT:
`{ "passage": "Quote text", "source": "Book/Author", "commentary": "Optional note", "tag": "optional-tag" }`

API endpoints return JSON responses.

### Project structure (MongoDB branch)

- **backend/** – Express server, Mongoose models, routes. Runs on port 8080.
- **frontend/** – React + Vite frontend code.
- **package.json** (root) – `npm run start` runs the backend.

### Frontend branch and React (A2)

A2 requires **at least 3 React+Vite views** and the front end to start with **`npm run dev`** on **http://localhost:5173**.

**Running backend and React dev server together**

1. **Terminal 1 – backend (port 8080)**  
   - Start MongoDB, then from the project root: `npm run start`  
   - Or from `backend/`: `npm install` then `npm run start`  
   - API base: **http://localhost:8080** (e.g. `http://localhost:8080/api/user`).

2. **Terminal 2 – React dev server (port 5173)**  
   - Check out or open the frontend (React) app (e.g. from the `frontend` branch or `frontend/` if it’s a Vite app).  
   - From that app’s folder: `npm install` then `npm run dev`.  
   - Open **http://localhost:5173** in the browser.

3. **Connecting React to the API**  
   - In the React app, call the backend with full URLs: `http://localhost:8080/api/user` (or set `VITE_API_URL=http://localhost:8080` and use that in fetch/axios).  
   - If the React app is served by Vite on 5173, same-origin does not apply to 8080; either use the full URL or configure Vite proxy to forward `/api` to `http://localhost:8080`.

## Reflection

This branch adds MongoDB to the app: the backend connects to MongoDB on startup, seeds data if the collection is empty, and implements full CRUD (create, read one, read many, update, delete) with appropriate HTTP methods and status codes under `/api/user`. The backend is modular (separate model and route files).
