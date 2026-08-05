import api from './axios';
import { useUser } from '../Context/useUser';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export function useAxiosInterceptors() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          if (user) {
            setUser(null);
            navigate('/login');
          }
        }
        return Promise.reject(error);
      },
    );
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [user, setUser, navigate]);
}
