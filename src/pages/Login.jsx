import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import AuthForm from '../components/AuthForm';
import animationData from '../assets/login_signup_animation.json';
import '../components/AuthForm.css';

export default function Login() {
  
  return (
    <div className="auth-page">
      <div className="auth-half form-side">
        <AuthForm type="login" />
      </div>
      <div className="auth-half animation-side">
        <Lottie animationData={animationData} loop={true} />
        <p className="switch-link">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}