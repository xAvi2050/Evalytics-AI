import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Evalytics-AI</h1>
      <p>Register or login to sit for the coding examination.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/signup" style={{ marginLeft: '1rem' }}>
        <button>Sign Up</button>
      </Link>
    </div>
  );
}
