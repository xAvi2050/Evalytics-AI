// Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LineChart, Line,
  RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import './Dashboard.css';

export default function Dashboard({ user }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Replace hardcoded user data
  const {
    name = 'User',
    xp = 0,
    rank = '--',
    stats = {},
    testHistory = [],
    certificates = [],
    radarSkills = [],
    progressData = []
  } = user || {};

  useEffect(() => {
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
        <button className="menu-toggle" onClick={() => setShowMobileMenu(!showMobileMenu)}>☰</button>
        <h2>Evalytics-AI</h2>
      </div>

      {/* Sidebar */}
      <aside className={`sidebar ${showMobileMenu ? 'show' : ''}`}>
        <div className="sidebar-header">
          <h2>Evalytics-AI</h2>
          <p>Your AI-Powered Coding Hub</p>
        </div>

        <nav className="sidebar-nav">
          {['overview', 'practice', 'tests', 'exams', 'results', 'certificates', 'settings'].map(tab => (
            <Link
              key={tab}
              to={`/dashboard/${tab === 'overview' ? '' : tab}`}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setShowMobileMenu(false)}
            >
              <span><i className={`fa-solid ${iconForTab(tab)}`}></i></span> {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
          <Link to="/logout" className="nav-item logout" onClick={() => setShowMobileMenu(false)}>
            <span><i className="fa-solid fa-right-from-bracket"></i></span> Logout
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'overview' && (
          <>
            {/* Welcome Section */}
            <header className="dashboard-header">
              <h1><i className="fa-solid fa-hand"></i> Hello, {name}!</h1>
              <div className="user-stats">
                <span>XP: {xp}</span>
                <span>Rank: #{rank}</span>
                <Link to="/profile" className="profile-link">View Profile</Link>
              </div>
            </header>

            {/* Stats */}
            <div className="stats-grid">
              <StatCard title="Tests Taken" value={stats.testsTaken || 0} change="+3 this month" />
              <StatCard title="Avg Score" value={`${stats.avgScore || 0}%`} change="↑ 5% from last month" />
              <StatCard title="Certificates" value={certificates.length} change="Earn more to unlock badge" />
              <StatCard title="Time Spent" value={stats.timeSpent || '0h'} change="Keep going!" />
            </div>

            {/* Quick Actions */}
            <div className="action-buttons">
              <Link to="/dashboard/tests" className="action-btn"><span>🧪</span> Take a New Test</Link>
              <Link to="/dashboard/practice" className="action-btn"><span>💻</span> Open Practice IDE</Link>
              <Link to="/dashboard/exams" className="action-btn"><span>📝</span> Start Full Exam</Link>
            </div>

            {/* Recommendations */}
            <div className="recommendation-card">
              <h3>AI Recommendations</h3>
              <p>Suggested focus: JavaScript array methods this week.</p>
              <div className="recommendation-content">
                <div className="recommendation-chart">
                  <RadarChart outerRadius={90} width={300} height={250} data={radarSkills}>
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

            {/* Line Chart */}
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
        {/* Other tabs like practice, tests, exams... */}
      </main>
    </div>
  );
}

// Helper components
function StatCard({ title, value, change }) {
  return (
    <div className="stat-card">
      <h3>{title}</h3>
      <p className="stat-value">{value}</p>
      <p className="stat-change">{change}</p>
    </div>
  );
}

function iconForTab(tab) {
  const icons = {
    overview: 'fa-house',
    practice: 'fa-laptop-code',
    tests: 'fa-vial',
    exams: 'fa-pen',
    results: 'fa-square-poll-vertical',
    certificates: 'fa-award',
    settings: 'fa-gear',
  };
  return icons[tab] || 'fa-circle';
}
