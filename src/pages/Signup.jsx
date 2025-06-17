import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import AuthForm from '../components/AuthForm';
import animationData from '../assets/login_signup_animation.json';
import '../components/AuthForm.css';

export default function Signup() {
  const navigate = useNavigate();
  return (
    <div className="auth-page">
      <div className="auth-half form-side">
        <AuthForm type="signup" />
      </div>
      <div className="auth-half animation-side">
        <Lottie animationData={animationData} loop={true} />
        <p className="switch-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}