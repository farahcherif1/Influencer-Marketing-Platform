import api from '../api/axios';
import type { User } from '../Types/Creator';

export const registerUser = async ({
  role,
  fullName,
  brandName,
  email,
  password,
}: {
  role: 'brand' | 'creator';
  fullName: string;
  brandName?: string;
  email: string;
  password: string;
}) => {
  const payload: Record<string, string> = {
    name: fullName,
    email,
    password,
  };

  if (role === 'brand' && brandName) {
    payload.brandName = brandName;
  }

  const response = await api.post(`/auth/signup?role=${role}`, payload);
  return response.data;
};
export const verifyEmailToken = async (
  token: string,
): Promise<{ user: User; accessToken: string }> => {
  const response = await api.post(`/auth/verify?token=${token}`);
  return { user: response.data.user, accessToken: response.data.accessToken };
};

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  const response = await api.post(`/auth/login`, { email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

export const handleLogout = async (
  setUser: (user: null) => void,
  navigate: (path: string) => void,
) => {
  try {
    const res = await api.post(`/auth/logout`);
    localStorage.clear();
    if (res.status == 200) {
      setUser(null);
      navigate('/login');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const requestPasswordReset = async ({ email }: { email: string }) => {
  await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const response = await api.post('/auth/reset-password', { token, newPassword });
  return response.data;
};

export const fetchUserRoleByUsername = async (username: string) => {
  const response = await api.get(`/user/${username}`);
  return response.data;
};
