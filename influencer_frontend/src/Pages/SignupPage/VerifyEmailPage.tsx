import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyEmailToken } from '../../services/authService';
import type { AxiosError } from 'axios';
import { useUser } from '../../Context/useUser';

export default function VerifyEmailPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('VerifyEmail');

  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const role = queryParams.get('role');

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim()) {
      setError('Please enter the 6-digit code');
      return;
    }

    try {
      setLoading(true);
      const { user, accessToken } = await verifyEmailToken(code);
      setUser({
        id: user.id,
        role: user.role,
        isVerified: user.isVerified,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
        accessToken,
        profileComplete: user.profileComplete,
      });

      localStorage.setItem('signupCompleted', 'true');
      localStorage.removeItem('referralCode');

      if (!user.profileComplete) {
        navigate(role === 'brand' ? '/complete-brand-profile' : '/complete-creator-profile', {
          state: { userId: user.id },
          replace: true,
        });
      } else {
        navigate('/');
      }
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pt: { xs: theme.spacing(4), sm: theme.spacing(10) },
          pb: { xs: theme.spacing(4), sm: theme.spacing(10) },
          px: { xs: theme.spacing(2), sm: 0 },
        }}
      >
        <Typography
          variant="h5"
          mb={2}
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.5rem' },
            textAlign: 'center',
          }}
        >
          {t('title', 'Verify your email')}
        </Typography>
        <Typography
          variant="body1"
          mb={4}
          sx={{
            textAlign: 'center',
            px: { xs: theme.spacing(1), sm: 0 },
          }}
        >
          {t('instruction', 'We sent an email to')} {email}.{' '}
          {t('enterCode', 'Enter the 6-digit code below')}:
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: { xs: '100%', sm: 400 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <TextField
            placeholder={t('placeholder.code', '6-Digit Code')}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!error}
            helperText={error}
          />
          <Button
            type="submit"
            disabled={loading}
            fullWidth
            sx={{
              py: '12px',
              px: '24px',
              backgroundColor: theme.palette.text.primary,
              color: 'white',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '12px',
              boxShadow: 'none',
            }}
          >
            {loading ? t('verifying', 'Verifying...') : t('continue', 'Continue')}
          </Button>
        </Box>
        <Typography
          variant="body2"
          mt={2}
          sx={{
            color: theme.palette.text.secondary,
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => alert('Resend logic here')}
        >
          {t('resend', 'I didn’t receive an email')}
        </Typography>
      </Box>
    </Box>
  );
}
