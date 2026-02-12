# Multi-page Web Application

## Overview

This is a simple notes app for CPS630 A1. Users can view a list of notes, add new ones, and delete them. The app uses a Node.js server with Express, three HTML pages (Home, Notes, About), and a REST API. Data is stored in a JSON file on the server (no database). In the future we could add a real database or rebuild the front end with React.

## Documentation

**How to run the project**

1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open a browser and go to: `http://localhost:8080`

**How to use it**

- **Home** (`/`) – intro and links to other pages
- **Notes** (`/notes`) – view all notes, add a note in the input and click Add, delete a note with the Delete button
- **About** (`/about`) – short description of the project

**REST API**

- `GET /api/notes` – returns the list of notes (JSON)
- `POST /api/notes` – add a note; send JSON body `{ "note": "your text" }`
- `DELETE /api/notes/:id` – delete the note with that id

## Reflection

We built a Node/Express server, three HTML pages with shared navigation and CSS, and a REST API with GET, POST, and DELETE. The Notes page uses the API so users can add and remove items. Challenges included wiring the client-side JavaScript to the API and handling errors. We got the server and API working with correct status codes and the three pages with a simple layout.
