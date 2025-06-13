import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Evalytics-AI</h1>
      <p className="home-subtitle">Register or login to sit for the coding examination.</p>
      <div className="home-buttons">
        <Link to="/login">
          <button className="home-btn login-btn">Login</button>
        </Link>
        <Link to="/signup">
          <button className="home-btn signup-btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
