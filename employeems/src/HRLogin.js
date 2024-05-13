import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import './Login.css'; // Import CSS file for styling
import { useNavigate } from 'react-router-dom';

const HRLogin = ({ onLogin }) => {
    const [username, setUsername] = useState(''); // Define username state variable
    const [password, setPassword] = useState(''); // Define password state variable
    const [error, setError] = useState(''); // Define error state variable

    const navigate = useNavigate();

// Inside handleLogin function:

      const handleForgotPasswordClick = () => {
        navigate('/forgot-password');
      };
      const handleLogin = async () => {
        try {
          const response = await axios.post('http://localhost:5001/api/hr/login', {
            username,
            // Implement secure password hashing on the backend (replace with hashed password)
            password: 'hashed_password', // Placeholder for hashed password
          });
          if (response.status === 200) {
            onLogin(response.data);
            console.log('Login Successful');
            navigate('/hr/dashboard');
          } else {
            setError('Login failed. Please check your credentials or contact the administrator.');
          }
        } catch (error) {
          setError('Invalid Username or Password');
        }
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
        <a href="#" onClick={handleForgotPasswordClick}>
        Forgot Password?
      </a>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
};

export default HRLogin;
