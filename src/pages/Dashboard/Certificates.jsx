import { Award } from 'lucide-react';

const Certificates = () => {
  return (
    <div className="text-white">
      <h1 className="text-4xl font-bold mb-8">My Certificates</h1>
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <Award className="mx-auto mb-4 text-yellow-400" size={48} />
        <h2 className="text-2xl font-bold mb-2">Your Achievements Will Appear Here</h2>
        <p className="text-gray-400">
          Once you pass a proctored exam, your official certificate will be available for download here.
        </p>
      </div>
    </div>
  );
};

export default Certificates;
