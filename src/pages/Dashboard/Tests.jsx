import { useState, useEffect } from 'react';
import api from '../../utils/api';

// Reusable Card Component
const ContentCard = ({ title, difficulty, tags, status, score, onClick }) => {
  const isCompleted = status === 'Completed';
  const difficultyColor = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-red-400',
  }[difficulty];

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {isCompleted && <span className="text-lg font-bold text-green-400">{score}%</span>}
      </div>
      <p className={`text-sm font-semibold ${difficultyColor}`}>{difficulty}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map(tag => <span key={tag} className="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{tag}</span>)}
      </div>
    </div>
  );
};


const Tests = () => {
  const [available, setAvailable] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testsRes, attemptsRes] = await Promise.all([
          api.get('/tests'),
          api.get('/user/attempts'),
        ]);

        const completedIds = new Set(attemptsRes.data.map(a => a.test_id));
        const availableTests = testsRes.data.filter(t => !completedIds.has(t._id));
        
        const completedTests = attemptsRes.data.map(attempt => {
            const originalTest = testsRes.data.find(t => t._id === attempt.test_id) || {};
            return { ...originalTest, ...attempt };
        });

        setAvailable(availableTests);
        setCompleted(completedTests);
      } catch (error) {
        console.error("Failed to fetch test data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-white">Loading Tests...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold text-white mb-8">Coding Tests</h1>
      
      <h2 className="text-2xl font-bold text-white mb-4">Available Tests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {available.map(item => (
          <ContentCard key={item._id} {...item} onClick={() => alert(`Starting Test: ${item.title}`)} />
        ))}
         {available.length === 0 && <p className="text-gray-400">No new tests available. Check back later!</p>}
      </div>

      <h2 className="text-2xl font-bold text-white mt-12 mb-4">Completed Tests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {completed.map(item => (
          <ContentCard key={item._id} {...item} status="Completed" onClick={() => alert(`Reviewing Test: ${item.title}`)} />
        ))}
        {completed.length === 0 && <p className="text-gray-400">You haven't completed any tests yet.</p>}
      </div>
    </div>
  );
};

export default Tests;
