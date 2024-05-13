import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminRegistration from './AdminRegistration';
import HRRegistration from './HRRegistration';
import AdminLogin from './AdminLogin';
import HRLogin from './HRLogin';
import './App.css';
import ForgotPassword from './ForgotPassword';

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
  const [registrationData, setRegistrationData] = useState(null); // State to store registration data

  const handleRegistrationSuccess = (data) => {
    setRegistrationData(data);
    console.log('Registration successful:', data); // You can further handle the registration data here
  };
  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setIsAdmin(data.isAdmin);
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
                    {isAdmin && <AdminDashboard />}
                    {!isAdmin && <HRDashboard />}
                  </div>
                )}
              </div>
            }
          />
        <Route path="/hr/register" element={<HRRegistration />} /> {/* Define route for HRRegistration */}
          <Route path="/admin/register" element={<AdminRegistration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/hr/register" element={<HRRegistration />} />
          <Route path="/admin" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/hr" element={<HRLogin onLogin={handleLogin} />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* New route for Admin Dashboard */}
          <Route path="/hr/dashboard" element={<HRDashboard />} /> {/* New route for Admin Dashboard */}

        </Routes>
      </div>
    </Router>
  );
};
export default App;