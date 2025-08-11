import { useUser } from '../../utils/UserContext';
import { UserCircle, Mail, Phone, BarChart3, Clock } from 'lucide-react';

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-gray-800 p-4 rounded-lg flex items-center">
        <div className="p-2 bg-gray-700 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-md font-semibold text-white">{value || 'N/A'}</p>
        </div>
    </div>
);

const Profile = () => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="text-center text-white">Loading Profile...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-400">Could not load user profile.</div>;
  }

  const stats = user.stats || {};

  return (
    <div>
      <div className="flex items-center mb-8">
        <UserCircle size={64} className="text-blue-400 mr-4" />
        <div>
          <h1 className="text-4xl font-bold text-white">{user.firstName} {user.lastName}</h1>
          <p className="text-lg text-gray-400">@{user.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard icon={<Mail size={20} className="text-blue-300" />} label="Email" value={user.email} />
        <InfoCard icon={<Phone size={20} className="text-green-300" />} label="Phone Number" value={user.phoneNumber} />
        <Info-card icon={<Clock size={20} className="text-gray-300" />} label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
        
        <InfoCard icon={<BarChart3 size={20} className="text-yellow-300" />} label="Tests Taken" value={stats.tests_taken} />
        <InfoCard icon={<BarChart3 size={20} className="text-yellow-300" />} label="Average Score" value={`${(stats.avg_score || 0).toFixed(1)}%`} />
        <InfoCard icon={<BarChart3 size={20} className="text-yellow-300" />} label="Experience Points" value={stats.xp} />
      </div>
    </div>
  );
};

export default Profile;
