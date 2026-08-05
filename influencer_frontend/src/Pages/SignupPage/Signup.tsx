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
import { useLocation, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { isRtl } from '../../i18n/isRtl';
import { registerUser } from '../../services/authService';
import type { AxiosError } from 'axios';

export default function SignUpPage() {
  const { t } = useTranslation('Signup');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role') === 'brand' ? 'brand' : 'creator';

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    brandName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const { fullName, brandName, email, password } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!fullName.trim()) {
      newErrors.fullName = t('SignupBrand.validation.required', 'Full name is required');
    }

    if (role === 'brand' && !brandName.trim()) newErrors.brandName = 'Brand name is required';

    if (!email.trim()) {
      newErrors.email = t('SignupBrand.validation.required', 'Email is required');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('validation.email', 'Invalid email format');
    }

    if (!password.trim()) {
      newErrors.password = t('SignupBrand.validation.required', 'Password is required');
    } else if (password.length < 6) {
      newErrors.password = t(
        'SignupBrand.validation.passwordLength',
        'Password must be at least 6 characters',
      );
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

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerUser({ ...formData, role });
      navigate(`/verify-email?role=${role}`);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error('Signup failed:', axiosError.response?.data?.message || axiosError.message);
      setErrors({ api: 'Signup failed. Please try again.' });
    }
  };

  const handleGoogleSignup = () => {
    const state = encodeURIComponent(JSON.stringify({ role }));
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login?state=${state}`;
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
          component="h1"
          sx={{
            mt: { xs: theme.spacing(10), sm: theme.spacing(3) },
            mb: theme.spacing(3),
            fontWeight: theme.typography.h4?.fontWeight ?? 600,
            fontSize: { xs: '1rem', sm: '2rem' },
            lineHeight: { xs: 1.3, sm: 1.2 },
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {role === 'brand'
            ? t('SignupBrand.createYourAccount', 'Create Your Brand Account')
            : t('SignupCreator.createYourAccount', 'Create Your Creator Account')}
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
            mt: { xs: theme.spacing(2), sm: theme.spacing(4) },
          }}
        >
          <Button
            fullWidth
            onClick={handleGoogleSignup}
            sx={{
              py: { xs: '10px', sm: '12px' },
              px: { xs: '20px', sm: '24px' },
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
            {t('SignupBrand.continueWithGoogle', 'Continue with Google')}
          </Button>
          <Divider sx={{ my: { xs: 2, sm: 3 }, color: theme.palette.text.secondary }}>
            {t('SignupBrand.or', 'or')}
          </Divider>
          <TextField
            placeholder={t('SignupBrand.fullName', 'Full Name')}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
          {role === 'brand' && (
            <TextField
              placeholder={t('SignupBrand.brandName', 'Brand Name')}
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              error={!!errors.brandName}
              helperText={errors.brandName}
            />
          )}
          <TextField
            placeholder={t('SignupBrand.email', 'Email')}
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
            placeholder={t('SignupBrand.password', 'Password')}
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
            {t('SignupBrand.signUp', 'Sign Up')}
          </Button>
          <Typography
            variant="body2"
            align="center"
            mt={theme.spacing(2)}
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.813rem', sm: '0.875rem' },
            }}
          >
            {t('SignupBrand.agreementPrefix', 'By signing up, you agree to our')}{' '}
            <Box
              component="span"
              onClick={() => navigate('/terms')}
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }}
            >
              {t('SignupBrand.terms', 'Terms')}
            </Box>{' '}
            {t('SignupBrand.and', 'and')}{' '}
            <Box
              component="span"
              onClick={() => navigate('/privacy')}
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }}
            >
              {t('SignupBrand.privacyPolicy', 'Privacy Policy')}
            </Box>
            .
          </Typography>

          <Typography
            variant="body2"
            align="center"
            mt={theme.spacing(1)}
            sx={{
              color: theme.palette.text.secondary,
              fontSize: { xs: '0.813rem', sm: '0.875rem' },
            }}
          >
            {t('SignupBrand.alreadyHaveAccount', 'Already have an account?')}{' '}
            <Box
              component="span"
              onClick={() => navigate('/login')}
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }}
            >
              {t('SignupBrand.login', 'Login')}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
