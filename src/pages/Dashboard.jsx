import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import './Dashboard.css';

export default function Dashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sample data for charts
  const progressData = [
    { month: 'Jan', Python: 65, JavaScript: 45, 'C++': 30 },
    { month: 'Feb', Python: 70, JavaScript: 55, 'C++': 40 },
    { month: 'Mar', Python: 78, JavaScript: 65, 'C++': 50 },
    { month: 'Apr', Python: 82, JavaScript: 72, 'C++': 58 },
    { month: 'May', Python: 85, JavaScript: 80, 'C++': 65 },
    { month: 'Jun', Python: 87, JavaScript: 84, 'C++': 73 },
  ];

  const radarData = [
    { subject: 'Python', A: 87, fullMark: 100 },
    { subject: 'JavaScript', A: 84, fullMark: 100 },
    { subject: 'C++', A: 73, fullMark: 100 },
    { subject: 'Algorithms', A: 68, fullMark: 100 },
    { subject: 'Data Structures', A: 75, fullMark: 100 },
  ];

  const testResults = [
    { id: 1, date: '12 June', type: 'Test', language: 'Python', score: 87, time: '18m' },
    { id: 2, date: '10 June', type: 'Exam', language: 'C++', score: 73, time: '58m' },
    { id: 3, date: '5 June', type: 'Test', language: 'JavaScript', score: 84, time: '25m' },
    { id: 4, date: '1 June', type: 'Test', language: 'Python', score: 82, time: '22m' },
  ];

  const certificates = [
    { id: 1, title: 'Advanced Python Test', date: 'June 2023', status: 'Certified' },
    { id: 2, title: 'Frontend JavaScript Exam', date: 'May 2023', status: 'Certified' },
  ];

  useEffect(() => {
    // Set active tab based on current route
    const path = location.pathname.split('/dashboard/')[1] || 'overview';
    setActiveTab(path);
  }, [location]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.className = !darkMode ? 'dark-theme' : '';
  };

  return (
    <div className={`dashboard-container ${darkMode ? 'dark' : 'light'}`}>
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="menu-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>
          ☰
        </button>
        <h2>Evalytics-AI</h2>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${showMobileMenu ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h2>Evalytics-AI</h2>
          <p>Your AI-Powered Coding Hub</p>
        </div>

        <nav className="sidebar-nav">
          <Link 
            to="/dashboard" 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>🏠</span> Dashboard
          </Link>
          
          <Link 
            to="/dashboard/practice" 
            className={`nav-item ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>💻</span> Practice IDE
          </Link>
          
          <Link 
            to="/dashboard/tests" 
            className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>🧪</span> Tests
          </Link>
          
          <Link 
            to="/dashboard/exams" 
            className={`nav-item ${activeTab === 'exams' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>📝</span> Full Exams
          </Link>
          
          <Link 
            to="/dashboard/results" 
            className={`nav-item ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>📊</span> My Results
          </Link>
          
          <Link 
            to="/dashboard/certificates" 
            className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>🎓</span> Certificates
          </Link>
          
          <Link 
            to="/dashboard/settings" 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setShowMobileMenu(false)}
          >
            <span>⚙️</span> Settings
          </Link>
          
          <Link 
            to="/logout" 
            className="nav-item logout"
            onClick={() => setShowMobileMenu(false)}
          >
            <span>🚪</span> Logout
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <>
            {/* Welcome Header */}
            <header className="dashboard-header">
              <h1>👋 Hello, Shubham!</h1>
              <div className="user-stats">
                <span>XP: 4200</span>
                <span>Rank: #34</span>
                <Link to="/profile" className="profile-link">View Profile</Link>
              </div>
            </header>

            {/* Quick Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Tests Taken</h3>
                <p className="stat-value">12</p>
                <p className="stat-change">+3 this month</p>
              </div>
              
              <div className="stat-card">
                <h3>Avg Score</h3>
                <p className="stat-value">84%</p>
                <p className="stat-change">↑ 5% from last month</p>
              </div>
              
              <div className="stat-card">
                <h3>Certificates</h3>
                <p className="stat-value">3</p>
                <p className="stat-change">Earn 2 more for next badge</p>
              </div>
              
              <div className="stat-card">
                <h3>Time Spent</h3>
                <p className="stat-value">9h 32m</p>
                <p className="stat-change">Consistent 5-day streak</p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="action-buttons">
              <Link to="/dashboard/tests" className="action-btn">
                <span>🧪</span> Take a New Test
              </Link>
              <Link to="/dashboard/practice" className="action-btn">
                <span>💻</span> Open Practice IDE
              </Link>
              <Link to="/dashboard/exams" className="action-btn">
                <span>📝</span> Start Full Exam
              </Link>
            </div>

            {/* AI Recommendations */}
            <div className="recommendation-card">
              <h3>AI Recommendations</h3>
              <p>Based on your history, we suggest focusing on JavaScript array methods this week.</p>
              <div className="recommendation-content">
                <div className="recommendation-chart">
                  <RadarChart outerRadius={90} width={300} height={250} data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </RadarChart>
                </div>
                <div className="recommendation-actions">
                  <button className="primary-btn">Start Recommended Test</button>
                  <button className="secondary-btn">View Study Plan</button>
                </div>
              </div>
            </div>

            {/* Progress Charts */}
            <div className="progress-section">
              <h3>Your Progress</h3>
              <div className="chart-container">
                <LineChart width={600} height={300} data={progressData}>
                  <Line type="monotone" dataKey="Python" stroke="#8884d8" />
                  <Line type="monotone" dataKey="JavaScript" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="C++" stroke="#ffc658" />
                </LineChart>
              </div>
            </div>
          </>
        )}

        {activeTab === 'practice' && (
          <div className="practice-ide">
            <h2>Practice IDE</h2>
            <div className="language-selector">
              <select>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
                <option value="c">C</option>
              </select>
            </div>
            
            <div className="editor-container">
              <div className="code-editor">
                <pre>{`function reverseString(str) {
  // Write your code here
  return str.split('').reverse().join('');
}

// Test your code
console.log(reverseString("hello")); // Should output "olleh"`}</pre>
              </div>
              
              <div className="editor-controls">
                <div className="input-output">
                  <div className="input-section">
                    <h4>Input:</h4>
                    <textarea placeholder="Enter custom input here..."></textarea>
                  </div>
                  <div className="output-section">
                    <h4>Output:</h4>
                    <div className="output-console">
                      <pre>No output yet. Run your code to see results.</pre>
                    </div>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button className="run-btn">Run Code</button>
                  <button className="reset-btn">Reset</button>
                  <label className="ai-hint-toggle">
                    <input type="checkbox" /> Enable AI Hints
                  </label>
                  <button className="save-btn">Save Snippet</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="tests-section">
            <h2>Language Tests</h2>
            <div className="test-filters">
              <div className="language-filter">
                <label>Language:</label>
                <select>
                  <option value="all">All Languages</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                  <option value="c">C</option>
                </select>
              </div>
              
              <div className="difficulty-filter">
                <label>Difficulty:</label>
                <div className="difficulty-options">
                  <button className="active">Beginner</button>
                  <button>Intermediate</button>
                  <button>Advanced</button>
                </div>
              </div>
            </div>
            
            <div className="test-list">
              <div className="test-card">
                <h3>Python Basics</h3>
                <p>Test your fundamental Python knowledge with 15 questions</p>
                <div className="test-meta">
                  <span>⏱️ 30 mins</span>
                  <span>📝 15 questions</span>
                  <span>💯 Max score: 100</span>
                </div>
                <button className="start-test-btn">Start Test</button>
              </div>
              
              <div className="test-card">
                <h3>JavaScript Functions</h3>
                <p>Master JavaScript functions with this intermediate test</p>
                <div className="test-meta">
                  <span>⏱️ 25 mins</span>
                  <span>📝 12 questions</span>
                  <span>💯 Max score: 100</span>
                </div>
                <button className="start-test-btn">Start Test</button>
              </div>
              
              <div className="test-card">
                <h3>C++ OOP Concepts</h3>
                <p>Advanced test on Object-Oriented Programming in C++</p>
                <div className="test-meta">
                  <span>⏱️ 45 mins</span>
                  <span>📝 20 questions</span>
                  <span>💯 Max score: 100</span>
                </div>
                <button className="start-test-btn">Start Test</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="exams-section">
            <h2>Full Coding Exams</h2>
            <div className="exam-info">
              <p>Simulated assessment environments with multiple coding questions</p>
            </div>
            
            <div className="exam-list">
              <div className="exam-card">
                <h3>Full Stack Developer Exam</h3>
                <p>Comprehensive test covering frontend and backend concepts</p>
                <div className="exam-meta">
                  <span>⏱️ 120 mins</span>
                  <span>📝 10+ coding questions</span>
                  <span>🎓 Certificate on passing</span>
                </div>
                <div className="exam-proctoring">
                  <input type="checkbox" id="proctoring" />
                  <label htmlFor="proctoring">Enable proctoring (webcam required)</label>
                </div>
                <button className="start-exam-btn">Start Exam</button>
              </div>
              
              <div className="exam-card">
                <h3>Data Structures Certification</h3>
                <p>Test your knowledge of algorithms and data structures</p>
                <div className="exam-meta">
                  <span>⏱️ 90 mins</span>
                  <span>📝 8 coding challenges</span>
                  <span>🎓 Certificate on passing</span>
                </div>
                <div className="exam-proctoring">
                  <input type="checkbox" id="proctoring2" />
                  <label htmlFor="proctoring2">Enable proctoring (webcam required)</label>
                </div>
                <button className="start-exam-btn">Start Exam</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="results-section">
            <h2>My Results</h2>
            <div className="results-filters">
              <select>
                <option value="all">All Languages</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="c++">C++</option>
              </select>
              
              <select>
                <option value="all">All Types</option>
                <option value="test">Tests</option>
                <option value="exam">Exams</option>
              </select>
              
              <input type="date" placeholder="Filter by date" />
            </div>
            
            <div className="results-view">
              <div className="table-view">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Language</th>
                      <th>Score</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((test) => (
                      <tr key={test.id}>
                        <td>{test.date}</td>
                        <td>{test.type}</td>
                        <td>{test.language}</td>
                        <td>
                          <div className="score-bar" style={{ '--score': `${test.score}%` }}>
                            {test.score}%
                          </div>
                        </td>
                        <td>{test.time}</td>
                        <td>
                          <button className="view-btn">View</button>
                          <button className="download-btn">Download Report</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="chart-view">
                <h3>Performance by Language</h3>
                <BarChart width={500} height={300} data={[
                  { name: 'Python', score: 87 },
                  { name: 'JavaScript', score: 84 },
                  { name: 'C++', score: 73 },
                ]}>
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="certificates-section">
            <h2>My Certificates</h2>
            <div className="certificate-list">
              {certificates.map((cert) => (
                <div key={cert.id} className="certificate-card">
                  <div className="certificate-badge">✅</div>
                  <div className="certificate-details">
                    <h3>{cert.title} – {cert.status}</h3>
                    <p>Earned on {cert.date}</p>
                  </div>
                  <div className="certificate-actions">
                    <button className="download-btn">Download PDF</button>
                    <button className="share-btn">Share to LinkedIn</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="certificate-preview">
              <h3>Certificate Preview</h3>
              <div className="preview-container">
                <div className="certificate-template">
                  <h4>Evalytics-AI</h4>
                  <h2>Certificate of Achievement</h2>
                  <p>This certifies that <strong>Shubham</strong> has successfully completed the</p>
                  <h3>Advanced Python Test</h3>
                  <p>with a score of <strong>87%</strong> on June 12, 2023</p>
                  <div className="signature">
                    <p>Evalytics-AI Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-section">
            <h2>Account Settings</h2>
            
            <div className="settings-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" defaultValue="Shubham" />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="shubham@example.com" />
              </div>
              
              <div className="form-group">
                <label>Change Password</label>
                <input type="password" placeholder="Current password" />
                <input type="password" placeholder="New password" />
                <input type="password" placeholder="Confirm new password" />
              </div>
              
              <div className="form-group">
                <label>Preferred Language</label>
                <select>
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Theme</label>
                <div className="theme-options">
                  <button 
                    className={`theme-btn ${darkMode ? '' : 'active'}`}
                    onClick={() => setDarkMode(false)}
                  >
                    ☀️ Light Mode
                  </button>
                  <button 
                    className={`theme-btn ${darkMode ? 'active' : ''}`}
                    onClick={() => setDarkMode(true)}
                  >
                    🌙 Dark Mode
                  </button>
                </div>
              </div>
              
              <button className="save-settings-btn">Save Changes</button>
            </div>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}