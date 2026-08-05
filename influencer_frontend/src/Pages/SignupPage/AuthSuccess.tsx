import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../Context/useUser';
import { getCurrentUser } from '../../services/authService';

export default function AuthSuccess() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const role = params.get('role');

  useEffect(() => {
    async function loadUser() {
      try {
        // Will use the access_token cookie
        const user = await getCurrentUser();
        setUser(user);

        if (!user.profileComplete) {
          navigate(
            user.role === 'brand' ? '/complete-brand-profile' : '/complete-creator-profile',
            {
              replace: true,
            },
          );
        } else {
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error('AuthSuccess failed:', err);
        navigate('/login', { replace: true });
      }
    }

    loadUser();
  }, [setUser, navigate, role]);

  return <p>Loading...</p>;
}
