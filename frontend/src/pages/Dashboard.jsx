import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../utils/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // First, try to get user from localStorage (for immediate display after signup)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setLoading(false);
      } catch (err) {
        console.error('Failed to parse stored user:', err);
      }
    }

    // Then fetch fresh data from API
    const fetchUser = async () => {
      try {
        const response = await getMe();
        if (response.data.success) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        setError('Failed to load user information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError('Failed to logout');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading-container">
          <p className="loading">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <h1 className="logo-text">JOB BAZAR</h1>
          </div>
          
          <div className="navbar-user">
            <div className="user-profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <span className="dropdown-arrow">▼</span>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <strong>{user?.name}</strong>
                  <p className="user-email">{user?.email}</p>
                </div>
                <hr className="dropdown-divider" />
                <button className="dropdown-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area - Ready for your content */}
      <div className="dashboard-content">
        {/* Add your content here */}
      </div>
    </div>
  );
};

export default Dashboard;