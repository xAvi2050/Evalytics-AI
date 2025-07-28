// 📄 Overview.jsx
import { useUser } from '../../utils/UserContext';

const Overview = () => {
  const { user } = useUser();
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard Overview</h1>
      <p>Welcome back, {user?.firstName}!</p>
    </div>
  );
};

export default Overview;