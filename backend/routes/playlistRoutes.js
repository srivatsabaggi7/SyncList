const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const SECRET = 'mysecret123'; // Make sure this matches your server's secret

// Song Schema
const SongSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: String,
});

// Playlist Schema
const PlaylistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  songs: [SongSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

// Middleware to verify token and extract user ID
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token provided' });

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Get all playlists for logged in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.userId });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Create new playlist
router.post('/', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Playlist name required' });

  try {
    const newPlaylist = new Playlist({ name, userId: req.userId });
    await newPlaylist.save();
    res.status(201).json(newPlaylist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add playlist' });
  }
});

// Update playlist name
router.put('/:id', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Playlist name required' });

  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name },
      { new: true }
    );
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

// Delete playlist
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Playlist.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) return res.status(404).json({ error: 'Playlist not found' });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// Add song to playlist
router.post('/:id/songs', authMiddleware, async (req, res) => {
  const { title, artist } = req.body;
  if (!title) return res.status(400).json({ error: 'Song title required' });

  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.userId });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    playlist.songs.push({ title, artist });
    await playlist.save();

    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add song' });
  }
});

// Get songs of a playlist by playlist ID  <--- NEW ROUTE
router.get('/:id/songs', authMiddleware, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, userId: req.userId });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    res.json(playlist.songs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Remove song from playlist
router.delete('/:playlistId/songs/:songId', authMiddleware, async (req, res) => {
  const { playlistId, songId } = req.params;

  try {
    const playlist = await Playlist.findOne({ _id: playlistId, userId: req.userId });
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    playlist.songs = playlist.songs.filter(song => song._id.toString() !== songId);
    await playlist.save();

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove song' });
  }
});

module.exports = router;
