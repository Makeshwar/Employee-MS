import React, { useState, useRef } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS file for styling
import ForgotPassword from './ForgotPassword'; // Import the ForgotPassword component

const HRLogin = ({ onLogin }) => {
  const [username, setUsername] = useState(''); // Username state variable
  const [password, setPassword] = useState(''); // Password state variable
  const [error, setError] = useState(''); // Error state variable
  const [showForgotPassword, setShowForgotPassword] = useState(false); // State to control the visibility of the ForgotPassword component
  const navigate = useNavigate();

  const handleRegister = () => {
    // Handle registration externally (e.g., navigate to the hr registration page)
    window.location.href = '/hr/register';
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5001/api/hr/login', {
        username,
        // Implement secure password hashing on the backend (replace with hashed password)
        password // Placeholder for hashed password
      });
      if (response.status === 200) {
        onLogin(response.data);
        console.log('Login Successful');
        navigate('/hr/dashboard');
      } else {
        setError('Login failed. Please check your credentials or contact the hristrator.');
      }
    } catch (error) {
      setError('Invalid Username or Password');
    }
  };

  // **Handle Forgot Password Click:**
  const handleForgotPasswordClick = () => {
    navigate('/forgot-password/hr'); // Navigate to the ForgotPassword page for hr
  };

  return (
    <div className="login-box">
      <h2>HR Login</h2>
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
      {/* Conditionally render the ForgotPassword component */}
      {showForgotPassword && <ForgotPassword userType="hr" />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default HRLogin;
