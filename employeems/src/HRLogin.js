import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import './Login.css'; // Import CSS file for styling
import { useHistory } from 'react-router-dom';

const HRLogin = ({ onLogin }) => {
    const [username, setUsername] = useState(''); // Define username state variable
    const [password, setPassword] = useState(''); // Define password state variable
    const [error, setError] = useState(''); // Define error state variable

    const handleLogin = () => {
      axios.post('http://localhost:5001/api/hr/login', { username, password })
        .then(response => {
          onLogin(response.data); // Assuming the response contains authentication status
        })
        .catch(error => {
          setError('Invalid username or password');
        });
    };

    const handleRegister = () => {
        // Handle registration externally (e.g., navigate to the admin registration page)
        window.location.href = '/hr/register';
      };
  

    return (
      <div className="login-box">
        <h2>HR Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
};

export default HRLogin;
