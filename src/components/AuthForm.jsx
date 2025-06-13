import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

export default function AuthForm({ type }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateSignup = () => {
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!usernameRegex.test(username)) {
      return 'Username must be 5-15 characters long and contain only letters and numbers.';
    }

    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include letters, numbers, and one special character.';
    }

    return '';
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (type === 'signup') {
      const validationError = validateSignup();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    console.log(type === 'login' ? 'Logging in:' : 'Signing up:', { username, password });
    setError('');
    navigate('/dashboard');
  };

  const getPasswordStrength = () => {
    if (password.length < 8) return 'Weak';
    if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) return 'Strong';
    return 'Moderate';
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{type === 'login' ? 'Login' : 'Sign Up'}</h2>

      {error && <p className="auth-error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />


        {type === 'signup' && password && (
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
