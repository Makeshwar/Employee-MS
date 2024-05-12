import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import AdminRegistration from './AdminRegistration';
import HRRegistration from './HRRegistration';
import AdminLogin from './AdminLogin';
import HRLogin from './HRLogin';
import './App.css';


const AdminDashboard = () => {
  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
    </div>
  );
};

const HRDashboard = () => {
  return (
    <div className="dashboard">
      <h2>HR Dashboard</h2>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setIsAdmin(data.isAdmin);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <div>
                {!isLoggedIn && (
                  <div className="login-container">
                    <h2>Welcome to the PR3 Employee Management System</h2>
                    <p>Please choose an option to login:</p>
                    <div className="login-options">
                      <Link to="/admin" className="login-option">
                        Admin Login
                      </Link>
                      <Link to="/hr" className="login-option">
                        HR Login
                      </Link>
                    </div>
                  </div>
                )}
                {isLoggedIn && (
                  <div>
                    <h1>Welcome {isAdmin ? 'Admin' : 'HR'}</h1>
                    <button onClick={handleLogout}>Logout</button>
                    {isAdmin && <AdminDashboard />}
                    {!isAdmin && <HRDashboard />}
                  </div>
                )}
              </div>
            }
          />
          <Route path="/admin/register" element={<AdminRegistration />} />
          <Route path="/hr/register" element={<HRRegistration />} />
          <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/hr" element={<HRLogin onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
