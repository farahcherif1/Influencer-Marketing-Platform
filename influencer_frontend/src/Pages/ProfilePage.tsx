import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CreatorProfilePage from './CreatorProfilePage';
import BrandProfilePage from './BrandProfilePage';
import { fetchUserRoleByUsername } from '../services/authService';
import type { UserRole } from '../Types/Creator';

const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [userData, setUserData] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) {
        setUserData(null);
        setLoading(false);
        return;
      }
      try {
        const data = await fetchUserRoleByUsername(username);
        setUserData(data);
      } catch (err) {
        console.error(err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>User not found</p>;

  return (
    <>
      {userData.role === 'creator' ? (
        <CreatorProfilePage />
      ) : userData.role === 'brand' ? (
        <BrandProfilePage />
      ) : (
        <p>Unknown role</p>
      )}
    </>
  );
};

export default ProfilePage;
