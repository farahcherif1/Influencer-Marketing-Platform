import React, { useState } from 'react';
import { Box, Button, TextField, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';
import { requestPasswordReset } from '../../services/authService';
import type { AxiosError } from 'axios';

export default function ForgotPasswordPage() {
  const { t, i18n } = useTranslation('Signup');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const navigate = useNavigate();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email.trim()) {
      newErrors.email = t('validation.required');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t('validation.email');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await requestPasswordReset({ email });
      setSuccessMessage(t('ForgotPasswordPage.success'));
      setErrors({});
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ message: string }>;
      console.error(
        'Password reset failed:',
        axiosError.response?.data?.message || axiosError.message,
      );
      setErrors({
        api: t('ForgotPasswordPage.error'),
      });
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh' }}>
      <Box
        sx={{
          mx: 'auto',
          direction: direction,
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
            mt: { xs: theme.spacing(8), sm: theme.spacing(3) },
            mb: theme.spacing(3),
            fontWeight: 600,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          {t('ForgotPasswordPage.title')}
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
            mt: theme.spacing(2),
          }}
        >
          <TextField
            placeholder={t('ForgotPasswordPage.email')}
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
          />

          {errors.api && (
            <Typography
              color="error"
              variant="body2"
              align="center"
              sx={{ fontSize: { xs: '0.813rem', sm: '0.875rem' } }}
            >
              {errors.api}
            </Typography>
          )}

          {successMessage && (
            <Typography
              color="primary"
              variant="body2"
              align="center"
              sx={{
                color: theme.palette.text.primary,
                fontSize: { xs: '0.813rem', sm: '0.875rem' },
              }}
            >
              {successMessage}
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
            {t('ForgotPasswordPage.sendButton')}
          </Button>

          <Typography
            variant="body2"
            align="center"
            mt={theme.spacing(1)}
            sx={{
              color: theme.palette.text.secondary,
              cursor: 'pointer',
              fontSize: { xs: '0.813rem', sm: '0.875rem' },
            }}
            onClick={() => navigate('/login')}
          >
            {t('ForgotPasswordPage.backToLogin')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
