import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useHistory } from 'react-router-dom'; // Import useHistory for navigation
import './Login.css'; // Import CSS file for styling

const AdminLogin = ({ onLogin }) => {
    const [username, setUsername] = useState(''); // Define username state variable
    const [password, setPassword] = useState(''); // Define password state variable
    const [error, setError] = useState(''); // Define error state variable
    const history = useHistory(); // Get history object for navigation

    const handleLogin = () => {
      axios.post('http://localhost:5001/api/admin/login', { username, password })
        .then(response => {
          onLogin(response.data);
          console.log('Login Successful');// Assuming the response contains authentication status
          history.push('/admin/dashboard'); // Redirect to admin dashboard upon successful login
        })
        .catch(error => {
          setError('Invalid username or password');
        });
    };

    const handleRegister = () => {
      // Handle registration externally (e.g., navigate to the admin registration page)
      window.location.href = '/admin/register';
    };

    return (
      <div className="login-box">
        <h2>Admin Login</h2>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button> {/* Register button */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
};

export default AdminLogin;
