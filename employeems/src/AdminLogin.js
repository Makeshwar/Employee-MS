import React, { useState, useRef } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS file for styling
import ForgotPassword  from './ForgotPassword'; // Import the new ForgotPassword component

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState(''); // Username state variable
  const [password, setPassword] = useState(''); // Password state variable
  const [error, setError] = useState(''); // Error state variable
  const navigate = useNavigate();


  const handleForgotPassword = (email) => {
    // Implement logic to handle forgot password functionality (e.g., send reset email)
    console.log('Received email for forgot password:', email);
  };
  const handleRegister = () => {
    // Handle registration externally (e.g., navigate to the admin registration page)
    window.location.href = '/admin/register';
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/admin/login', {
        username,
        // Implement secure password hashing on the backend (replace with hashed password)
        password: 'hashed_password', // Placeholder for hashed password
      });
      if (response.status === 200) {
        onLogin(response.data);
        console.log('Login Successful');
        navigate('/admin/dashboard');
      } else {
        setError('Login failed. Please check your credentials or contact the administrator.');
      }
    } catch (error) {
      setError('Invalid Username or Password');
    }
  };

  // **Handle Forgot Password Click:**
  const handleForgotPasswordClick = () => {
    navigate('/forgot-password');
  };


  return (
    <div className="login-box">
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <a href="#" onClick={handleForgotPasswordClick}>
        Forgot Password?
      </a>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AdminLogin;
