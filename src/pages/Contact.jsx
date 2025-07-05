import './Contact.css';
import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import Contact_Animation from '../assets/Contact_Animation.json';

const Contact = () => {
  const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
  );

  const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  );


  return (
    <>
      <div className="contact-container">
        <div className="contact-logo">
          <Link to="/">
            <img src="/eai.png" alt="Logo" className="logo-img" />
          </Link>
        </div>

        <div className="contact-page-container">
          <div className="contact-card">
            <div className="contact-form-section">
              <h1>Contact us</h1>
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <span className="input-icon"><UserIcon /></span>
                  <input type="text" className="input-field" placeholder="Name" />
                </div>
                <div className="input-group">
                  <span className="input-icon"><EmailIcon /></span>
                  <input type="email" className="input-field" placeholder="Email" />
                </div>
                <div className="input-group">
                  <textarea className="input-field" placeholder="Message" style={{ paddingLeft: '1rem' }}></textarea>
                </div>
                <button type="submit" className="submit-btn">Send Message</button>
              </form>
            </div>
            <div className="animation-section">
              <Lottie animationData={Contact_Animation} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
