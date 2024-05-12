import React, { useState } from 'react';
import axios from 'axios';
import './registrationForm.css'; // Import the CSS file

const AdminRegistration = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleRegister = () => {
    // Validate form fields
    if (!name || !username || !password || !confirmPassword || !email || !phoneNumber) {
      setError('All fields are required');
      return;
    }
  
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    axios.post('http://localhost:5001/api/admin/register', { name, username, password, email, phoneNumber })
      .then(response => {
        onRegister(response.data); // Assuming the response contains registration status
        console.log('Registration successful'); // Log success message
      })
      .catch(error => {
        setError('Registration failed');
        console.error('Error registering admin:', error); // Log registration error
      });
  };

  return (
    <div className="registration-container"> {/* Apply container styles */}
      <h2 className="registration-title">Admin Registration</h2> {/* Apply title styles */}
      <div className="registration-form"> {/* Apply form styles */}
        <input className="registration-input" type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="registration-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="registration-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input className="registration-input" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <input className="registration-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="registration-input" type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <button className="registration-button" onClick={handleRegister}>Register</button> {/* Apply button styles */}
        {error && <p className="registration-error">{error}</p>} {/* Apply error message styles */}
      </div>
    </div>
  );
};

export default AdminRegistration;
