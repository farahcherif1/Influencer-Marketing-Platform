import { Navigate } from 'react-router-dom';
import { useUser } from '../Context/useUser';
import type { ReactNode } from 'react';

export default function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { user } = useUser();

  if (user && user.profileComplete) {
    return <Navigate to="/" replace />;
  } else if (user && !user.profileComplete) {
    if (user.role === 'creator') {
      return <Navigate to="/complete-creator-profile" replace />;
    } else if (user.role === 'brand') {
      return <Navigate to="/complete-brand-profile" replace />;
    }
  }
  return children;
}
