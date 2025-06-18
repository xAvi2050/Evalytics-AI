import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// bcrypt is no longer needed on the client-side as hashing is done on the server
import './AuthForm.css';

export default function AuthForm({ type }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // State to display success messages
  const navigate = useNavigate();

  // Define the base URL for your backend API
  // IMPORTANT: If your frontend is served from a different origin (e.g., React Dev Server),
  // ensure this matches your backend server's address (e.g., http://localhost:5000)
  const API_BASE_URL = 'http://localhost:5000/api';

  // Client-side validation for signup form fields
  const validateSignup = () => {
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/; // Username must be 5-15 characters, alphanumeric
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Min 8 chars, 1 letter, 1 digit, 1 special char

    if (!usernameRegex.test(username)) {
      return 'Username must be 5-15 characters long and contain only letters and numbers.';
    }

    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include letters, numbers, and one special character.';
    }

    return ''; // No validation errors
  };

  // Handles form submission for both login and signup
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');   // Clear any previous error messages
    setMessage(''); // Clear any previous success messages

    if (type === 'signup') {
      const validationError = validateSignup();
      if (validationError) {
        setError(validationError); // Display client-side validation error
        return;
      }

      try {
        // Make an actual API call to your backend's signup endpoint
        const response = await fetch(`${API_BASE_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) { // Check if the response status is 2xx (success)
          setMessage(data.message); // Display success message
          setUsername(''); // Clear form fields on successful registration
          setPassword('');
          // Optional: navigate to login page after successful signup
          // navigate('/login');
        } else {
          // Handle errors from the backend (e.g., username taken, validation errors)
          setError(data.message || 'Signup failed. Please try again.');
        }
      } catch (err) {
        console.error('Network error during signup:', err);
        setError('Could not connect to the server. Please check your network or server status.');
      }
    } else if (type === 'login') {
      try {
        // Make an actual API call to your backend's login endpoint
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) { // Check if the response status is 2xx (success)
          setMessage(data.message); // Display success message
          // In a real app, you might store a JWT token here
          // localStorage.setItem('token', data.token);

          // Navigate to the dashboard, passing the username as a URL parameter
          navigate(`/dashboard/${data.user.username}`);
        } else {
          // Handle errors from the backend (e.g., invalid credentials)
          setError(data.message || 'Login failed. Invalid username or password.');
        }
      } catch (err) {
        console.error('Network error during login:', err);
        setError('Could not connect to the server. Please check your network or server status.');
      }
    }
  };

  // Determines and returns the password strength
  const getPasswordStrength = () => {
    if (password.length === 0) return ''; // No strength indication if password is empty
    if (password.length < 8) return 'Weak'; // Less than 8 characters is weak
    // Strong if it meets the regex criteria (letters, digits, special chars)
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'Strong';
    return 'Moderate'; // Otherwise, moderate
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{type === 'login' ? 'Login' : 'Sign Up'}</h2>

      {/* Display error messages */}
      {error && <p className="auth-error">{error}</p>}
      {/* Display success messages */}
      {message && <p className="auth-message">{message}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username" // Helps browsers suggest usernames
        />

        <input
          className="auth-input"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          // Helps browsers suggest current/new password
          autoComplete={type === 'login' ? 'current-password' : 'new-password'}
        />

        <label className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>

        {/* Display password strength only for signup and if password is not empty */}
        {type === 'signup' && password.length > 0 && (
          <p className={`password-strength ${getPasswordStrength().toLowerCase()}`}>
            Strength: {getPasswordStrength()}
          </p>
        )}

        <button className="auth-button" type="submit">
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
