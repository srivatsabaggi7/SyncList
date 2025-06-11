# 🎵 Music Playlist Manager

A full-stack MERN (MongoDB, Express.js, React, Node.js) web application that allows users to create, manage, and share music playlists. Users can add songs, rename/delete playlists, and interact with a minimalistic, responsive UI.

---

## 🚀 Features

* ✅ User Authentication (Login & Register)
* 🎼 Create, rename, and delete playlists
* ➕ Add and remove songs in each playlist
* 🔍 Search songs within a playlist
* 📄 Share playlists via URL
* 💻 Responsive & clean UI using custom CSS
* 🌐 RESTful API architecture

---

## 🛠️ Tech Stack

**Frontend:**

* React.js
* React Router
* Axios
* Vanilla CSS (`style.css`)
* Firebase (optional for hosting)

**Backend:**

* Node.js
* Express.js
* MongoDB with Mongoose
* dotenv
* nodemon

---

## 📂 Project Structure

```
MusicPlaylistManager/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── style.css
├── README.md
└── package.json
```

---

## ⚙️ Getting Started

### Backend Setup

1. Navigate to backend folder:

```bash
cd backend
npm install
```

2. Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

3. Start the server:

```bash
npm run dev
```

---

### Frontend Setup

1. Navigate to frontend folder:

```bash
cd frontend
npm install
npm start
```

---

## 🌍 API Endpoints

### Playlist Routes

* `GET /api/playlists/` – Fetch all playlists
* `POST /api/playlists/` – Create new playlist
* `PUT /api/playlists/:id` – Rename playlist
* `DELETE /api/playlists/:id` – Delete playlist

### Song Routes

* `POST /api/playlists/:id/songs` – Add a song
* `DELETE /api/playlists/:playlistId/songs/:songId` – Delete a song

---


## 💡 Future Enhancements

* 🎷 Audio preview support
* 🌃 Dark mode
* 📊 Playlist analytics
* 🔐 Google/Facebook login

---
