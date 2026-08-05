import { Navigate } from 'react-router-dom';
import { useUser } from '../Context/useUser';
import type { ReactNode } from 'react';

export default function ProfileCompletionGuard({ children }: { children: ReactNode }) {
  const { user } = useUser();

  if (!user) return <Navigate to="/login" replace />;

  if (user.profileComplete) {
    return <Navigate to="/" replace />;
  }

  return children;
}
