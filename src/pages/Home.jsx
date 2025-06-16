import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'react-lottie';
import animationData from '../assets/animation.json';
import './Home.css';

export default function Home() {
  const [typedText, setTypedText] = useState('');
  const fullText = "Level Up with AI-Based Code Testing & Exams";
  
useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    return () => clearInterval(typingInterval);
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const [code, setCode] = useState(`def reverse_string(s):\n    return s[::-1]\n\nprint(reverse_string("hello"))`);
  const [language, setLanguage] = useState(71); // Python by default
  const [output, setOutput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const runCode = async () => {
    setIsSubmitting(true);
    setOutput('⏳ Running...');

    try {
      const { data } = await axios.post(
      'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=false',
      { source_code: code, language_id: language },
      {
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_JUDGE0_API_KEY,
          'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
      }
    );

    const poll = async () => {
      const res = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${data.token}?base64_encoded=false`,
        {
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_JUDGE0_API_KEY,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      if (res.data.status.id <= 2) {
        setTimeout(poll, 1000);
      } else {
        setOutput(res.data.stdout || res.data.stderr || res.data.compile_output || 'No output');
        setIsSubmitting(false);
      }
    };

    poll();
  } catch (err) {
    setOutput(`❌ Error: ${err.message}`);
    setIsSubmitting(false);
  }
};

  return (
    <div className="home-container">
      {/* 1. Header / Navigation Bar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="logo">
            <img src="/eai.png" alt="Logo" className="logo-icon" width={100} />
            <span>Evalytics-AI</span>
          </div>
          
          <nav className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/tests">Tests</Link>
            <Link to="/ide">IDE Practice</Link>
            <Link to="/exams">Exams</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>

          <button className="mobile-menu-btn">☰</button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="typewriter">{typedText}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="hero-subtitle">
            Practice. Test. Certify. Master coding through structured assessments and an intelligent IDE.
          </p>
          <div className="hero-cta">
            <Link to="/practice" className="cta-primary">Start Coding</Link>
            <Link to="/sample-test" className="cta-secondary">Take a Sample Test</Link>
          </div>
        </div>
        <div className="lottie-container" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Lottie options={defaultOptions}/>
        </div>
      </section>

      {/* 3. Key Offerings Cards */}
      <section className="offerings-section">
        <h2 className="section-title">Master Coding with Our AI Platform</h2>
        <div className="offerings-grid">
          <div className="offering-card">
            <div className="offering-icon">🧠</div>
            <h3>Coding Language Tests</h3>
            <p>Timed tests in Python, Java, C++, etc. Auto-graded with explanations. Beginner to advanced levels.</p>
            <Link to="/tests" className="offering-btn">Try Now</Link>
          </div>
          
          <div className="offering-card">
            <div className="offering-icon">👨‍💻</div>
            <h3>Practice IDE</h3>
            <p>Real-time online editor with hints & test cases. AI hints and code feedback. Save and track your practice history.</p>
            <Link to="/practice" className="offering-btn">Explore</Link>
          </div>
          
          <div className="offering-card">
            <div className="offering-icon">🧾</div>
            <h3>Full Exam Mode</h3>
            <p>Exam interface simulating real interview tests. Proctoring support & final reports. Certification on completion.</p>
            <Link to="/exams" className="offering-btn">Learn More</Link>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How Evalytics-AI Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your free account in seconds</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Select Skill Path</h3>
            <p>Choose Test, Practice, or Exam mode</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Solve & Submit Code</h3>
            <p>Write code in our intelligent IDE</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get AI Feedback</h3>
            <p>Receive detailed score reports</p>
          </div>
          
          <div className="step">
            <div className="step-number">5</div>
            <h3>Track Progress</h3>
            <p>Download certificates and improve</p>
          </div>
        </div>
      </section>
      
      {/* 5. Featured Languages Section */}
      <section className="languages-section">
        <h2 className="section-title">Practice & Test in Your Favorite Language</h2>
        <div className="languages-grid">
          {['Python', 'Java', 'C++', 'C', 'JavaScript', 'SQL'].map((lang) => (
            <div key={lang} className="language-card">
              <div className="language-icon">
                {lang === 'Python' ? '🐍' : 
                 lang === 'Java' ? '☕' : 
                 lang === 'C++' ? '💠' : 
                 lang === 'C' ? '💻' : 
                 lang === 'JavaScript' ? '🟨' : '🐘'}
              </div>
              <h3>{lang}</h3>
              <div className="language-actions">
                <Link to={`/practice/${lang.toLowerCase()}`}>Practice Mode</Link>
                <Link to={`/tests/${lang.toLowerCase()}`}>Test Mode</Link>
              </div>
            </div>
          ))}
        </div>
        <p className="coming-soon">+ More languages coming soon</p>
      </section>

      {/* 6. Live Demo Section */}
      <section className="demo-section">
        <h2 className="section-title">Try Our Online IDE Now</h2>
        <div className="code-editor-container">
          <div className="problem-statement">
            <h3>Problem: Reverse a string in Python</h3>
          </div>

          <textarea
          className="code-editor-container"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          />

          <div className="editor-actions">
            <button className="run-btn" onClick={runCode} disabled={isSubmitting}>
              {isSubmitting ? 'Running...' : 'Run Code'}
            </button>
            <button className="submit-btn">Submit</button>
          </div>

          <div className="output-panel">
            <h4>Output</h4>
              <div className="output-content">
                <pre>{output}</pre>
              </div>
            </div>
          </div>

        <p className="login-prompt">Sign in to save your progress and access more problems</p>
      </section>


      {/* 7. Why Evalytics-AI? Section */}
      <section className="benefits-section">
        <h2 className="section-title">Why Choose Evalytics-AI?</h2>
        <div className="benefits-grid">
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <h3>AI-Powered Evaluations</h3>
            <p>Get detailed feedback on your code quality and performance</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <h3>Instant Feedback & Reports</h3>
            <p>Real-time results with actionable insights</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <h3>Adaptive Learning</h3>
            <p>Questions adjust to your skill level</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <h3>Track Progress</h3>
            <p>Visualize your improvement over time</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <h3>Resume Boost</h3>
            <p>Earn verifiable certificates</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon">✅</div>
            <h3>Developer-Focused UX</h3>
            <p>Built by developers, for developers</p>
          </div>
        </div>
      </section>

      {/* 8. Certifications + Exam Showcase */}
      <section className="certification-section">
        <div className="certification-content">
          <h2 className="section-title">Ace Your Exams with Confidence</h2>
          <p>Our proctored exam environment simulates real technical interviews with timed sections, question navigation, and comprehensive evaluation.</p>
          <ul className="certification-features">
            <li>Proctored sessions (optional)</li>
            <li>Detailed scorecard & downloadable results</li>
            <li>Multiple re-attempt support</li>
            <li>Industry-recognized certificates</li>
          </ul>
          <Link to="/exams" className="cta-primary">Explore Full Exam Mode</Link>
        </div>
        <div className="certification-image">
          {/* Exam dashboard preview would go here */}
          <div className="dashboard-mockup"></div>
        </div>
      </section>

      {/* 9. Testimonials */}
      <section className="testimonials-section">
        <h2 className="section-title">What Developers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-text">"Got my job after acing tests here!"</p>
            <p className="testimonial-author">— Aayush, Software Engineer</p>
          </div>
          
          <div className="testimonial-card">
            <p className="testimonial-text">"Practiced C++ daily with Evalytics IDE"</p>
            <p className="testimonial-author">— Minal, CS Student</p>
          </div>
          
          <div className="testimonial-card">
            <p className="testimonial-text">"The AI feedback helped me improve my Python skills dramatically"</p>
            <p className="testimonial-author">— Raj, Data Scientist</p>
          </div>
        </div>
      </section>

      {/* 10. Tech Stack / Trust Logos */}
      <section className="techstack-section">
        <h2 className="section-title">Powered By</h2>
        <div className="techstack-grid">
          <div className="tech-item">React ⚛️</div>
          <div className="tech-item">Node.js 🔗</div>
          <div className="tech-item">OpenAI API 🤖</div>
          <div className="tech-item">PostgreSQL</div>
          <div className="tech-item">Docker</div>
          <div className="tech-item">Firebase</div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="final-cta">
        <h2>Ready to Test Your Skills and Get Certified?</h2>
        <p>Join thousands of developers improving their coding skills with Evalytics-AI</p>
        <Link to="/signup" className="cta-primary large">Sign Up & Start Learning Now</Link>
        <div className="badge">Earn points and badges!</div>
      </section>

      {/* 12. Footer */}
      <footer className="main-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">💻</span>
            <span>Evalytics-AI</span>
          </div>
          
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/github">GitHub</Link>
            <Link to="/linkedin">LinkedIn</Link>
            <a href="mailto:info@evalytics.ai">Contact</a>
          </div>
          
          <div className="social-icons">
            <a href="#"><span>📘</span></a>
            <a href="#"><span>🐦</span></a>
            <a href="#"><span>📸</span></a>
          </div>
        </div>
        
        <div className="copyright">
          © 2025 Evalytics-AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}