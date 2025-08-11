// src/pages/Dashboard/Exams.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Assuming api utility is in src/utils/api.js
import { FileText, Clock, AlertTriangle } from 'lucide-react';

const ExamCard = ({ exam, onStart }) => (
  <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all">
    <div className="flex items-center mb-4">
      <FileText className="text-blue-400 mr-3" size={24} />
      <h3 className="text-xl font-bold text-white">{exam.title}</h3>
    </div>
    <div className="flex items-center text-gray-400 text-sm mb-6">
      <Clock size={16} className="mr-2" />
      <span>{exam.duration_minutes} Minutes</span>
    </div>
    <button
      onClick={() => onStart(exam._id)}
      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105"
    >
      Start Exam
    </button>
  </div>
);

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/exams');
        setExams(response.data);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        setError("Could not load exams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const handleStartExam = (examId) => {
    // The confirmation is now handled in the ExamEnvironment component
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return <div className="text-center text-white">Loading Available Exams...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-lg">
        <AlertTriangle className="mx-auto mb-4" size={48} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-8">Proctored Exams</h1>
      {exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <ExamCard key={exam._id} exam={exam} onStart={handleStartExam} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
          <FileText className="mx-auto mb-4 text-gray-500" size={48} />
          <h2 className="text-2xl font-bold mb-2">No Exams Available</h2>
          <p className="text-gray-400">
            There are currently no exams scheduled. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Exams;