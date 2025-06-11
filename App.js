import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import PlaylistManager from './PlaylistManager';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/playlists" element={<PlaylistManager />} />
      </Routes>
    </BrowserRouter>
  );
}
