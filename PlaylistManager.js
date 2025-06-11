import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/playlists';

export default function PlaylistManager() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newSong, setNewSong] = useState({ title: '', artist: '' });
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const token = localStorage.getItem('token');
  const axiosConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` },
  }), [token]);

  const fetchPlaylists = useCallback(async () => {
    setError('');
    try {
      const res = await axios.get(BASE_URL, axiosConfig);
      setPlaylists(res.data);
      setSelectedPlaylist(null);
      setEditingPlaylistId(null);
    } catch {
      setError('Failed to fetch playlists');
    }
  }, [axiosConfig]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleAddPlaylist = async () => {
    if (!name.trim()) {
      setError('Playlist name cannot be empty');
      return;
    }
    setError('');
    try {
      await axios.post(BASE_URL, { name }, axiosConfig);
      setName('');
      fetchPlaylists();
    } catch {
      setError('Failed to add playlist');
    }
  };

  const handleRenamePlaylist = async (id) => {
    if (!newPlaylistName.trim()) {
      setError('New playlist name cannot be empty');
      return;
    }
    setError('');
    try {
      await axios.put(`${BASE_URL}/${id}`, { name: newPlaylistName }, axiosConfig);
      setEditingPlaylistId(null);
      setNewPlaylistName('');
      fetchPlaylists();
    } catch {
      setError('Failed to rename playlist');
    }
  };

  const handleDeletePlaylist = async (id) => {
    if (!window.confirm('Delete this playlist?')) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`, axiosConfig);
      fetchPlaylists();
    } catch {
      setError('Failed to delete playlist');
    }
  };

  const handleAddSong = async () => {
    if (!newSong.title.trim()) {
      setError('Song title cannot be empty');
      return;
    }
    setError('');
    try {
      await axios.post(`${BASE_URL}/${selectedPlaylist._id}/songs`, newSong, axiosConfig);
      setNewSong({ title: '', artist: '' });
      // Refresh playlists and keep the selected playlist opened
      await fetchPlaylists();
      setSelectedPlaylist(
        playlists.find(pl => pl._id === selectedPlaylist._id)
      );
    } catch {
      setError('Failed to add song');
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!window.confirm('Remove this song?')) return;
    try {
      await axios.delete(`${BASE_URL}/${selectedPlaylist._id}/songs/${songId}`, axiosConfig);
      await fetchPlaylists();
      setSelectedPlaylist(
        playlists.find(pl => pl._id === selectedPlaylist._id)
      );
    } catch {
      setError('Failed to remove song');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Your Playlists</h2>
      {error && <p style={styles.error}>{error}</p>}

      <input
        type="text"
        placeholder="New playlist name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleAddPlaylist} style={styles.addButton}>
        Add Playlist
      </button>

      <ul style={styles.list}>
        {playlists.length === 0 && <li>No playlists found</li>}
        {playlists.map(pl => (
          <li key={pl._id} style={styles.listItem}>
            {editingPlaylistId === pl._id ? (
              <>
                <input
                  value={newPlaylistName}
                  onChange={e => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist name"
                />
                <button onClick={() => handleRenamePlaylist(pl._id)}>Save</button>
                <button onClick={() => setEditingPlaylistId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span
                  style={{ cursor: 'pointer', fontWeight: selectedPlaylist?._id === pl._id ? 'bold' : 'normal' }}
                  onClick={() => setSelectedPlaylist(pl)}
                >
                  {pl.name}
                </span>{' '}
                <button onClick={() => {
                  setEditingPlaylistId(pl._id);
                  setNewPlaylistName(pl.name);
                }}>Rename</button>{' '}
                <button onClick={() => handleDeletePlaylist(pl._id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {selectedPlaylist && (
        <div style={styles.songsContainer}>
          <h3>Songs in "{selectedPlaylist.name}"</h3>
          <ul>
            {(selectedPlaylist.songs || []).length === 0 && <li>No songs</li>}
            {(selectedPlaylist.songs || []).map(song => (
              <li key={song._id}>
                {song.title} {song.artist && `- ${song.artist}`}{' '}
                <button onClick={() => handleRemoveSong(song._id)}>Remove</button>
              </li>
            ))}
          </ul>

          <div style={styles.addSongForm}>
            <input
              placeholder="Song title"
              value={newSong.title}
              onChange={e => setNewSong({ ...newSong, title: e.target.value })}
              style={styles.input}
            />
            <input
              placeholder="Artist"
              value={newSong.artist}
              onChange={e => setNewSong({ ...newSong, artist: e.target.value })}
              style={styles.input}
            />
            <button onClick={handleAddSong}>Add Song</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' },
  error: { color: 'red' },
  input: { margin: '5px 10px 5px 0', padding: 5 },
  addButton: { padding: '5px 10px', cursor: 'pointer' },
  list: { listStyle: 'none', padding: 0 },
  listItem: { marginBottom: 10 },
  songsContainer: { marginTop: 20 },
  addSongForm: { marginTop: 10 },
};
