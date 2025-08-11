import { useUser } from '../../utils/UserContext';

const StatCard = ({ label, value, icon }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4">
    <div className="bg-blue-600 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const Overview = () => {
  const { user } = useUser();

  if (!user) return <div>Loading user data...</div>;

  const stats = user.stats || {};

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.firstName}!</h1>
      <p className="text-gray-400 mb-8">Here's a snapshot of your journey on Evalytics-AI.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Experience Points" value={stats.xp ?? '0'} icon="✨" />
        <StatCard label="Tests Taken" value={stats.tests_taken ?? '0'} icon="📝" />
        <StatCard label="Average Score" value={`${(stats.avg_score ?? 0).toFixed(1)}%`} icon="🎯" />
      </div>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Start a New Session</h2>
        <p className="text-gray-400 mb-6">Ready to sharpen your skills? Jump into a practice session or take a test.</p>
        <div className="flex space-x-4">
          <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
            Start Practice
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105">
            Take a Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
