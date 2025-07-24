// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useUser } from '../utils/UserContext';
import api from '../utils/api';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const path = location.pathname.split('/dashboard/')[1] || 'overview';
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get('/user/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    };

    if (!user) {
      fetchUserData();
    }
  }, [navigate, setUser, user]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-900 text-white">
        <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="text-2xl">☰</button>
        <h2 className="text-xl font-bold">Evalytics-AI</h2>
      </div>

      {/* Sidebar */}
      <aside className={`${showMobileMenu ? 'block' : 'hidden'} md:block fixed md:relative z-50 w-64 h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white`}>
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold">Evalytics-AI</h2>
          <p className="text-blue-200 text-sm">Your AI-Powered Coding Hub</p>
        </div>

        <nav className="p-4">
          {['overview', 'practice', 'tests', 'exams', 'results', 'certificates', 'settings'].map((tab) => (
            <Link
              key={tab}
              to={`/dashboard/${tab === 'overview' ? '' : tab}`}
              className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
                activeTab === tab ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="mr-3">{iconForTab(tab)}</span>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 rounded-lg text-red-200 hover:bg-red-800 w-full mt-4 border-t border-blue-800 pt-4"
          >
            <span className="mr-3">🔴</span> Logout
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-full p-2 rounded-lg bg-blue-800 text-white hover:bg-blue-700"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-6 md:ml-64">
        {activeTab === 'overview' && user && (
          <>
            {/* Welcome Section */}
            <header className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={user.files?.profileImageUrl || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full border shadow"
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold dark:text-white">
                    👋 Hello, {user.firstName}!
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 dark:text-gray-300">XP: {user.stats?.xp || 0}</span>
                <span className="text-gray-700 dark:text-gray-300">Rank: #{user.stats?.rank || 0}</span>
                <Link to="/profile" className="text-blue-600 dark:text-blue-400 hover:underline">
                  View Profile
                </Link>
              </div>
            </header>

            {/* Rest of dashboard as before... */}

            {/* ... Stats, Quick Actions, Recommendations, Progress Chart */}

          </>
        )}
        <Outlet />
      </main>
    </div>
  );
};

const StatCard = ({ title, value, change }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold dark:text-white mb-1">{value}</p>
    <p className="text-green-500 text-sm">{change}</p>
  </div>
);

const iconForTab = (tab) => {
  const icons = {
    overview: '🏠',
    practice: '💻',
    tests: '🧪',
    exams: '📝',
    results: '📊',
    certificates: '🏆',
    settings: '⚙️',
  };
  return icons[tab] || '🔘';
};

export default Dashboard;