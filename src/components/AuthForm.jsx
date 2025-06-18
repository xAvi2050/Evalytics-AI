import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

export default function AuthForm({ type }) {
  // Common state for both login and signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // State to display success messages
  const navigate = useNavigate();

  // New state variables for signup form details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91'); // Default to +91 for India
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Define the base URL for your backend API
  // IMPORTANT: Ensure this matches your backend server's address (e.g., http://localhost:5000)
  const API_BASE_URL = 'http://localhost:5000/api';

  // Client-side validation for signup form fields
  const validateSignup = () => {
    // Basic validations
    if (!firstName || !lastName || !email || !phoneNumber || !username || !password || !confirmPassword) {
      return 'Please fill in all required fields.';
    }

    // Name validation
    if (firstName.length < 2 || lastName.length < 2) {
      return 'First Name and Last Name must be at least 2 characters long.';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }

    // Phone number validation (10 digits after country code)
    const fullPhoneNumber = countryCode + phoneNumber;
    const phoneRegex = /^\+\d{1,3}\d{10}$/; // Example: +911234567890
    if (!phoneRegex.test(fullPhoneNumber)) {
      return 'Please enter a valid 10-digit phone number with country code (e.g., +911234567890).';
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/; // Username must be 5-15 characters, alphanumeric
    if (!usernameRegex.test(username)) {
      return 'Username must be 5-15 characters long and contain only letters and numbers.';
    }

    // Password validation (min 8 chars, 1 letter, 1 digit, 1 special char)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include letters, numbers, and one special character.';
    }

    // Password match validation
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    // Terms and Conditions validation
    if (!agreedToTerms) {
      return 'You must agree to the terms and conditions.';
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
        // Prepare signup data including new fields
        const signupData = {
          firstName,
          lastName,
          email,
          phoneNumber: countryCode + phoneNumber, // Send full phone number
          username,
          password,
          // agreedToTerms is implicitly checked by validation, no need to send if backend doesn't store
        };

        // Make an actual API call to your backend's signup endpoint
        const response = await fetch(`${API_BASE_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData)
        });

        const data = await response.json();

        if (response.ok) { // Check if the response status is 2xx (success)
          setMessage(data.message); // Display success message
          // Clear all form fields on successful registration
          setFirstName('');
          setLastName('');
          setEmail('');
          setCountryCode('+91');
          setPhoneNumber('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setAgreedToTerms(false);
          setShowPassword(false);
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
    if (password.length === 0) return '';
    if (password.length < 8) return 'Weak';
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'Strong';
    return 'Moderate';
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{type === 'login' ? 'Login' : 'Sign Up'}</h2>

      {/* Display error messages */}
      {error && <p className="auth-error">{error}</p>}
      {/* Display success messages */}
      {message && <p className="auth-message">{message}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        {type === 'signup' && (
          <>
            <div className="name-inputs">
              <input
                className="auth-input half-width"
                type="text"
                placeholder="First Name"
                required
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
              <input
                className="auth-input half-width"
                type="text"
                placeholder="Surname"
                required
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>

            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />

            <div className="phone-inputs">
              <select
                className="auth-input country-code"
                value={countryCode}
                onChange={e => setCountryCode(e.target.value)}
              >
                <option value="+91">+91 (India)</option>
                <option value="+1">+1 (USA/Canada)</option>
                <option value="+44">+44 (UK)</option>
                {/* Add more country codes as needed */}
              </select>
              <input
                className="auth-input phone-number"
                type="tel"
                placeholder="Phone Number (10 digits)"
                required
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                autoComplete="tel-national"
                maxLength="10"
              />
            </div>
          </>
        )}

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          className="auth-input"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
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

        {type === 'signup' && password.length > 0 && (
          <p className={`password-strength ${getPasswordStrength().toLowerCase()}`}>
            Strength: {getPasswordStrength()}
          </p>
        )}

        {type === 'signup' && (
          <>
            <input
              className="auth-input"
              type={showPassword ? 'text' : 'password'}
              placeholder="Rewrite Password"
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={() => setAgreedToTerms(!agreedToTerms)}
                required
              />
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
            </label>
          </>
        )}

        <button className="auth-button" type="submit">
          {type === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}
