import { Navigate } from 'react-router-dom';
import { useUser } from '../Context/useUser';
import type { ReactNode } from 'react';

export default function AccessGuard({ children }: { children: ReactNode }) {
  const { user } = useUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.profileComplete) {
    if (user.role === 'creator') {
      return <Navigate to="/complete-creator-profile" replace />;
    }
    if (user.role === 'brand') {
      return <Navigate to="/complete-brand-profile" replace />;
    }
  }
  return children;
}
