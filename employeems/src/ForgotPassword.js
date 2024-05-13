import React, { useState } from 'react';
import './ForgotPassword.css'; // Import the CSS file

const ForgotPassword = ({ onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your registered email address.');
      return;
    }

    // Call the onForgotPassword prop function (passed from AdminLogin)
    onForgotPassword(email);

    // Clear the email input and potential error message after successful submission
    setEmail('');
    setError('');
  }; 

  return (
    <div className="forgot-password-form">
      <h3>Forgot Password?</h3>
      <input
        type="email"
        placeholder="Enter Registered Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleForgotPassword}>Send Reset Email</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
