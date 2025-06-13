import { useState } from 'react';

export default function AuthForm({ type }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (type === 'login') {
      console.log('Logging in:', { username, password });
    } else {
      console.log('Signing up:', { username, password });
    }
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>{type === 'login' ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          required
          value={username}
          onChange={e => setUsername(e.target.value)}
        /><br /><br />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        /><br /><br />
        <button type="submit">{type === 'login' ? 'Login' : 'Sign Up'}</button>
      </form>
    </div>
  );
}
