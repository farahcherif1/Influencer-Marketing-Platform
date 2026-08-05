import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { isRtl } from '../../i18n/isRtl';
import { loginUser } from '../../services/authService';
import { useUser } from '../../Context/useUser';
import type { AxiosError } from 'axios';

export default function LoginPage() {
  const { t } = useTranslation('Signup');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const navigate = useNavigate();
  const theme = useTheme();
  const { setUser } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const { email, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email.trim()) {
      newErrors.email = t('validation.required', 'Email is required');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('validation.email', 'Invalid email format');
    }

    if (!password.trim()) {
      newErrors.password = t('validation.required', 'Password is required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await loginUser(formData);
      const user = response.user;
      setUser({ ...user, accessToken: response.accessToken });
      navigate(`/profile/${user.name}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Login failed:', axiosError.response?.data?.message || axiosError.message);
      setErrors({ api: 'Login failed. Please check your credentials.' });
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box
        sx={{
          mx: 'auto',
          direction,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: theme.spacing(4), sm: theme.spacing(10) },
          pb: { xs: theme.spacing(4), sm: theme.spacing(10) },
          px: { xs: theme.spacing(2), sm: theme.spacing(3) },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: theme.spacing(2),
            fontWeight: 600,
            width: '100%',
            maxWidth: '420px',
            textAlign: 'center',
            mt: { xs: 8, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '2rem' },
          }}
        >
          {t('LoginPage.title', 'Welcome Back')}
          <Button
            fullWidth
            onClick={handleGoogleLogin}
            sx={{
              py: { xs: '10px', sm: '12px' },
              px: { xs: '20px', sm: '24px' },
              mt: theme.spacing(4),
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.text.secondary}`,
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.813rem', sm: '0.875rem' },
              boxShadow: theme.shadows[1],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              '&:hover': {
                backgroundColor: theme.palette.background.default,
              },
            }}
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
            {t('LoginPage.continueWithGoogle', 'Continue with Google')}
          </Button>
          <Divider sx={{ my: 2, color: theme.palette.text.secondary }}>
            {t('SignupBrand.or', 'or')}
          </Divider>
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 420,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing(2.5),
            mt: theme.spacing(1),
          }}
        >
          <TextField
            placeholder={t('LoginPage.email', 'Email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            placeholder={t('LoginPage.password', 'Password')}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePassword}
                    edge="end"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {errors.api && (
            <Typography color="error" variant="body2" align="center">
              {errors.api}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            sx={{
              py: { xs: '10px', sm: '12px' },
              px: { xs: '20px', sm: '24px' },
              backgroundColor: theme.palette.text.primary,
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.813rem', sm: '0.875rem' },
              borderRadius: '12px',
              boxShadow: 'none',
            }}
          >
            {t('LoginPage.loginButton', 'Login')}
          </Button>

          <Typography
            variant="body2"
            align="center"
            mt={theme.spacing(1)}
            sx={{ color: theme.palette.text.secondary, cursor: 'pointer' }}
            onClick={() => navigate('/forgot-password')}
          >
            {t('LoginPage.forgotPassword')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
