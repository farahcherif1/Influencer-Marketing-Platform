import { useState, type ReactNode, useEffect } from 'react';
import { UserContext } from './useUser';
import type { User } from '../Types/Creator';
import { getCurrentUser } from '../services/authService';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.accessToken) return;

    if (!user) {
      getCurrentUser()
        .then((fetchedUser) => {
          setUser({ ...fetchedUser, accessToken: parsedUser.accessToken });
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, [user]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
