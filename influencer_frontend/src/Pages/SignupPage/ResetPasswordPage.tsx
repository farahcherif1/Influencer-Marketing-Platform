import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';
import { resetPassword } from '../../services/authService';

export default function ResetPasswordPage() {
  const { t, i18n } = useTranslation('Signup');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const theme = useTheme();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t('validation.required');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('validation.passwordLength');
    }
    if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = t('validation.match');
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

  const handleTogglePassword = (field: 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      if (!token) return;

      const response = await resetPassword({ token, newPassword: formData.newPassword });
      setSuccessMessage(t('ResetPasswordPage.success', response.message));
    } catch (error) {
      console.error(error);
      setErrors({
        api: t('ResetPasswordPage.error'),
      });
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default }}>
      <Box
        sx={{
          mx: 'auto',
          direction,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: theme.spacing(2), sm: theme.spacing(1) },
          pb: { xs: theme.spacing(4), sm: theme.spacing(10) },
          px: { xs: theme.spacing(2), sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: theme.spacing(3),
            fontWeight: 600,
            width: { xs: '100%', sm: '420px' },
            textAlign: 'center',
            fontSize: { xs: '1.75rem', sm: '2.125rem' },
          }}
        >
          {t('ResetPasswordPage.title')}
        </Typography>

        {successMessage ? (
          <Typography
            color="primary"
            variant="h6"
            align="center"
            sx={{
              mt: theme.spacing(4),
              maxWidth: { xs: '100%', sm: 420 },
              color: theme.palette.text.primary,
              px: { xs: theme.spacing(2), sm: 0 },
            }}
          >
            {successMessage}
          </Typography>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              maxWidth: { xs: '100%', sm: 420 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(2.5),
              mt: theme.spacing(2),
            }}
          >
            <TextField
              placeholder={t('ResetPasswordPage.newPassword')}
              name="newPassword"
              type={showPassword.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword('new')}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              placeholder={t('ResetPasswordPage.confirmPassword')}
              name="confirmPassword"
              type={showPassword.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword('confirm')}
                      edge="end"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
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

            {successMessage && (
              <Typography color="primary" variant="body2" align="center">
                {successMessage}
              </Typography>
            )}

            <Button
              type="submit"
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
              {t('ResetPasswordPage.resetButton')}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
