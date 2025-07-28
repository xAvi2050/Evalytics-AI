import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../utils/UserContext';
import api from '../../utils/api';

const TABS = [
  { name: "overview", icon: "🏠" },
  { name: "profile", icon: "👤" },
  { name: "practice", icon: "💻" },
  { name: "tests", icon: "🧪" },
  { name: "exams", icon: "📝" },
  { name: "results", icon: "📊" },
  { name: "certificates", icon: "🏆" },
  { name: "settings", icon: "⚙️" },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Sync dark mode from localStorage on load
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark';
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const isDark = !darkMode;
    setDarkMode(isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', isDark);
  };

  useEffect(() => {
    const path = location.pathname.split('/dashboard/')[1] || 'overview';
    setActiveTab(path);
  }, [location]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/user/profile"); // cookie-based auth
        setUser(response.data);
      } catch (err) {
        console.error("User not authenticated:", err?.response?.data?.detail);
        // Don't navigate unless you're sure user is not logging in
      }
    };

    if (!user) fetchUserData();
  }, [user, setUser]);

  const handleLogout = async () => {
    try {
      await api.post('/logout'); // 🔐 Clears cookie on backend
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`fixed z-50 md:relative w-64 h-screen bg-gradient-to-b from-gray-900 to-blue-900 text-white ${showMobileMenu ? 'block' : 'hidden'} md:block`}>
        <div className="p-6 border-b border-blue-800">
          <h2 className="text-2xl font-bold">Evalytics-AI</h2>
          <p className="text-blue-200 text-sm">AI-Powered Coding Hub</p>
        </div>
        <nav className="p-4">
          {TABS.map(({ name, icon }) => (
            <Link
              key={name}
              to={`/dashboard/${name === 'overview' ? '' : name}`}
              className={`flex items-center p-3 rounded-lg mb-2 transition-colors ${
                activeTab === name ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800'
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              <span className="mr-3">{icon}</span>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center p-3 text-red-200 hover:bg-red-800 w-full mt-4 border-t border-blue-800 pt-4"
          >
            🔴 Logout
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
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
