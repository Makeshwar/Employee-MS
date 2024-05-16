import React, { useState } from 'react';
import axios from 'axios';
import './registrationForm.css'
const AdminRegistration = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !username || !password || !confirmPassword || !email || !phoneNumber) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Simpler password validation using regular expressions
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
   
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSymbol = /[!@#$%^&*]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasSymbol) {
      setError('Password must contain uppercase, lowercase, and symbol characters');
      return;
    }

    setIsLoading(true); // Set loading state to true

    try {
      const response = await axios.post('http://localhost:5001/api/admin/register', {
        name,
        username,
        password,
        email,
        phoneNumber,
      });
      onRegister(response.data);
      console.log('Registration successful'); // Log success message
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error); // Set specific error message from backend
      } else {
        setError('Registration failed'); // Generic error message
      }
      console.error('Error registering Admin:', error);
    } finally {
      setIsLoading(false); // Set loading state to false after request completes
    }
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">Admin Registration</h2>
      <div className="registration-form">
        <input
          className="registration-input"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="registration-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="registration-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="registration-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          className="registration-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="registration-input"
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {isLoading ? (
          <div className="loading-indicator">Loading...</div>
        ) : (
          <button className="registration-button" onClick={handleRegister}>
            Register
          </button>
        )}
        {error && <p className="registration-error">{error}</p>}
      </div>
    </div>
  );
};

export default AdminRegistration;