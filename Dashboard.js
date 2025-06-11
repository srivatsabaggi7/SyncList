import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // redirect to login
  };

  const username = 'User'; // You can update to fetch real username later

  return (
    <div style={styles.container}>
      <h1>Welcome, {username}!</h1>
      <Link to="/playlists" style={styles.link}>
        Manage Playlists
      </Link>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '50px auto',
    padding: 20,
    textAlign: 'center',
    border: '1px solid #ddd',
    borderRadius: 8,
    boxShadow: '0 2px 6px #ccc',
    fontFamily: 'Arial, sans-serif',
  },
  link: {
    display: 'inline-block',
    margin: '20px 0',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: 4,
  },
  logoutButton: {
    padding: '10px 15px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};
