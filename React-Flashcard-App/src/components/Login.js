import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Import the CSS file for styling

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/login', { username, password });
      localStorage.setItem('token', response.data.token);
      onLogin(); // Call the onLogin function to indicate a successful login
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome back to <span className="brand-name">takeUforward</span></h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ap2223222@gmail.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        <div className="footer-links">
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          <p>Don't have an account? <a href="/sign-up" className="sign-up">Sign up</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
