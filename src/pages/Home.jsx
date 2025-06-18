import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const testimonials = [
    {
      text: 'Got my job after acing tests here!',
      author: 'Aayush, Software Engineer',
      photo: '../users/aayush.jpg',
    },
    {
      text: 'Practiced C++ daily with Evalytics IDE',
      author: 'Minal, CS Student',
      photo: '../users/minal.webp',
    },
    {
      text: 'The AI feedback helped me improve my Python skills dramatically',
      author: 'Raj, Data Scientist',
      photo: '../users/raj.jpg',
    },
    {
      text: 'Evalytics helped me crack my first tech interview with confidence.',
      author: 'Priya, Frontend Developer',
      photo: '../users/priya.jpeg',
    },
    {
      text: 'Mock tests here feel exactly like real interviews. Highly recommended!',
      author: 'Sahil, Backend Engineer',
      photo: '../users/sahil.jpg',
    },
    {
      text: 'This platform made DSA finally click for me. Loved the explanations!',
      author: 'Neha, Software Intern',
      photo: '../users/neha.jpg',
    },
    {
      text: 'I practiced daily with their Java compiler and saw huge improvements.',
      author: 'Ankit, Java Developer',
      photo: '../users/ankit.webp',
    },
    {
      text: 'The UI is clean, fast, and perfect for serious prep.',
      author: 'Riya, B.Tech Student',
      photo: '../users/riya.gif',
    },
    {
      text: 'Evalytics gave me the structured path I needed. No more confusion.',
      author: 'Dev, Self-Taught Programmer',
      photo: '../users/dev.jpg',
    },
    {
      text: 'Their AI explained my mistakes better than any tutor.',
      author: 'Tanvi, Full Stack Developer',
      photo: '../users/tanvi.jpg',
    },
    {
      text: 'Honestly, this app kept me consistent. And consistency got me hired.',
      author: 'Arjun, Associate Software Engineer',
      photo: '../users/arjun.jpg',
    },
    {
      text: 'I loved competing with others in real-time challenges!',
      author: 'Megha, Coding Enthusiast',
      photo: '../users/megha.jpg',
    },
    {
      text: 'I owe my internship to Evalytics. Period.',
      author: 'Kunal, Final Year Student',
      photo: '../users/kunal.jpg',
    },
  ];

  const VISIBLE_COUNT = 5;
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // We increment startIndex, and when it reaches the end, it wraps around.
      // To make the visual loop seamless, we need to ensure enough "cloned" elements
      // are present in the DOM for the transition.
      setStartIndex((prev) => (prev + 1)); // Increment without modulo initially for visual effect
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleFooterLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
    setTimeout(() => {
      const el = document.querySelector("#head");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50); // slight delay to ensure element is in DOM
  };

  return (
    <div className="home-container">
      {/* 1. Header / Navigation Bar */}
      <header className="navbar" id="head">
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
            <Link to="/login" className="cta-primary">Start Coding</Link>
            <Link to="/tests" className="cta-secondary">Take a Sample Test</Link>
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
            <div className="offering-icon"><i class="fa-solid fa-brain"></i></div>
            <h3>Coding Language Tests</h3>
            <p>Timed tests in Python, Java, C++, etc. Auto-graded with explanations. Beginner to advanced levels.</p>
            <Link to="/tests" className="offering-btn">Try Now</Link>
          </div>
          
          <div className="offering-card">
            <div className="offering-icon"><i class="fa-solid fa-laptop-code"></i></div>
            <h3>Practice IDE</h3>
            <p>Real-time online editor with hints & test cases. AI hints and code feedback. Save and track your practice history.</p>
            <Link to="/ide" className="offering-btn">Explore</Link>
          </div>
          
          <div className="offering-card">
            <div className="offering-icon"><i class="fa-solid fa-scroll"></i></div>
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
          {[
            { name: 'Python', iconClass: 'bxl-python' },
            { name: 'Java', iconClass: 'bxl-java' },
            { name: 'C++', iconClass: 'bxl-c-plus-plus' }, 
            { name: 'C', iconClass: 'fa-solid fa-c' }, 
            { name: 'JavaScript', iconClass: 'bxl-javascript' },
            { name: 'SQL', iconClass: 'bxs-data' },
          ].map((lang) => (
            <div key={lang.name} className="language-card">
              <div className="language-icon">
                {lang.name === 'C' ? (
                  <i className={lang.iconClass}></i> // ✅ Font Awesome icon
                ) : (
                  <i className={`bx ${lang.iconClass}`}></i> // ✅ Boxicons
                )}
              </div>
              <h3>{lang.name}</h3>
              <div className="language-actions">
                <Link to={`/practice/${lang.name.toLowerCase()}`}>Practice Mode</Link>
                <Link to={`/tests/${lang.name.toLowerCase()}`}>Test Mode</Link>
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
          className="code-editor"
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
            <div className="benefit-icon"><i class="fa-regular fa-circle-check"></i></div>
            <h3>AI-Powered Evaluations</h3>
            <p>Get detailed feedback on your code quality and performance</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon"><i class="fa-regular fa-circle-check"></i></div>
            <h3>Instant Feedback & Reports</h3>
            <p>Real-time results with actionable insights</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon"><i class="fa-regular fa-circle-check"></i></div>
            <h3>Adaptive Learning</h3>
            <p>Questions adjust to your skill level</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon"><i class="fa-regular fa-circle-check"></i></div>
            <h3>Track Progress</h3>
            <p>Visualize your improvement over time</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon"><i class="fa-regular fa-circle-check"></i></div>
            <h3>Resume Boost</h3>
            <p>Earn verifiable certificates</p>
          </div>
          
          <div className="benefit-item">
            <div className="benefit-icon"><i class="fa-regular fa-circle-check"></i></div>
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
        <div className="carousel-outer">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${startIndex * (100 / VISIBLE_COUNT)}%)`,
              transition: 'transform 0.6s ease-in-out'
            }}
            onTransitionEnd={() => {
              if (startIndex >= testimonials.length) {
                setStartIndex(0);
              }
            }}
          >
            {
              [...testimonials, ...testimonials.slice(0, VISIBLE_COUNT -1)].map((testimonial, i) => {
                return (
                  <div className="testimonial-card" key={i}>
                    <img className="testimonial-photo" src={testimonial.photo} alt={testimonial.author} />
                    <p className="testimonial-text">"{testimonial.text}"</p>
                    <p className="testimonial-author">— {testimonial.author}</p>
                  </div>
                );
              })
            }
          </div>
        </div>
      </section>

      {/* 10. Tech Stack / Trust Logos */}
      <section className="techstack-section">
        <h2 className="section-title">Powered By</h2>
        <div className="techstack-grid">
          <div className="tech-item">React <i class="fa-brands fa-react"></i></div>
          <div className="tech-item">Node.js <i class="fa-brands fa-node-js"></i></div>
          <div className="tech-item">OpenAI API</div>
          <div className="tech-item">PostgreSQL</div>
          <div className="tech-item">Docker <i class="fa-brands fa-docker"></i></div>
          <div className="tech-item">Firebase <i class='bx bxl-firebase'></i></div>
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
            <Link to="/" onClick={handleFooterLogoClick}>
              <img src="/eai.png" alt="Logo" className="logo-icon" width={100} />
            </Link>
          </div>
          <div className="footer-links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/github">GitHub</Link>
            <Link to="/linkedin">LinkedIn</Link>
            <a href='mailto:avijitrajak@gmail.com'>Contact</a>
          </div>
          
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <span><i className="fa-brands fa-facebook"></i></span>
            </a>
            <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
              <span><i className="fa-brands fa-x-twitter"></i></span>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <span><i className="fa-brands fa-instagram"></i></span>
            </a>
          </div>

        </div>
        
        <div className="copyright">
          © 2025 Evalytics-AI. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}