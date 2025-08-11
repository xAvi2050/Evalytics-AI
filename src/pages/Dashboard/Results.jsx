import { BarChart3 } from 'lucide-react';

const Results = () => {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-8">My Results</h1>
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <BarChart3 className="mx-auto mb-4 text-green-400" size={48} />
        <h2 className="text-2xl font-bold mb-2">Detailed Analytics Coming Soon</h2>
        <p className="text-gray-400">
          Review in-depth performance analytics from your tests and exams here.
          <br />
          We are currently building this feature.
        </p>
      </div>
    </div>
  );
};

export default Results;
