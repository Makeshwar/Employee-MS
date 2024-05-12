import React, { useState } from 'react';
import axios from 'axios';
import './registrationForm.css';

const HRRegistration = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name || !username || !password || !confirmPassword || !email || !phoneNumber) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    axios.post('http://localhost:5001/api/hr/register', { name, username, password, email, phoneNumber })
      .then(response => {
        onRegister(response.data);
        console.log('Registration successful'); // Log success message
      })
      .catch(error => {
        setError('Registration failed');
      });
  };

  return (
    <div className="registration-container">
      <h2 className="registration-title">HR Registration</h2>
      <div className="registration-form">
        <input className="registration-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="registration-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="registration-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="registration-input" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <input className="registration-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="registration-input" type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button className="registration-button" onClick={handleRegister}>Register</button>
        {error && <p className="registration-error">{error}</p>}
      </div>
    </div>
  );
};

export default HRRegistration;
