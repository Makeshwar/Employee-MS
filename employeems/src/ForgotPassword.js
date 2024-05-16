import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
  const { userType } = useParams(); // Extract userType from URL parameter
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }
  
    try {
      let endpoint = '';
      if (userType === 'admin') {
        endpoint = 'http://localhost:5001/api/admin/forgot-password';
      } else if (userType === 'hr') {
        endpoint = 'http://localhost:5001/api/hr/forgot-password';
      }
  
      // Send a POST request with userType along with email
      const response = await axios.post(endpoint, { email, userType }); // Add userType to the request body
  
      // Check if the request was successful
      if (response.status === 200) {
        setSuccess(response.data.message);
      }
    } catch (error) {
      setError('Error: Failed to send password reset email. Please try again later.');
    }
  };
  
  return (
    <div className="forgot-password-form">
      <h3>{userType === 'admin' ? 'Admin' : 'HR'} Forgot Password?</h3>
      <input
        type="email"
        placeholder="Enter Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Send Reset Email</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default ForgotPassword;
