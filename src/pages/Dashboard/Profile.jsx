// 📄 Profile.jsx
import { useUser } from '../../utils/UserContext';

const Profile = () => {
  const { user } = useUser();
  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-4">👤 Profile Information</h1>
      <p>Email: {user?.email}</p>
      <p>Username: {user?.username}</p>
    </div>
  );
};

export default Profile;