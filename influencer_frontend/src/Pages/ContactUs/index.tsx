import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  Stack,
  Fade,
  Card,
  Grid,
  Divider,
  useTheme,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const ContactUs: React.FC = () => {
  const { t, i18n } = useTranslation('contact');
  const theme = useTheme();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    const { fullName, email, phone, subject, message } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const phoneRegex = /^\+?[\d\s()-]{7,}$/;

    if (!fullName.trim()) {
      newErrors.fullName = t?.('validation.required');
    }

    if (!email.trim()) {
      newErrors.email = t?.('validation.required');
    } else if (!emailRegex.test(email)) {
      newErrors.email = t?.('validation.email');
    }

    if (phone.trim() && !phoneRegex.test(phone)) {
      newErrors.phone = t?.('validation.phone');
    }

    if (!subject.trim()) {
      newErrors.subject = t?.('validation.required');
    }

    if (!message.trim()) {
      newErrors.message = t?.('validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setSubmitError('');

    if (!validate()) return;

    setTimeout(() => {
      const successSim = Math.random() > 0.3;
      if (successSim) {
        setSuccess(t('successMessage'));
        setFormData({ fullName: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitError(t('errorMessage'));
      }
    }, 1000);
  };

  const styles = {
    paper: {
      p: 4,
      mx: 'auto',
      mt: 8,
    },
    langSwitcher: {
      display: 'flex',
      justifyContent: 'flex-end',
      mb: 2,
      color: theme.palette.primary.light,
    },
    title: {
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      mb: 2,
    },
    subtitle: {
      fontWeight: theme.typography.subtitle1.fontWeight,
      color: theme.palette.text.secondary,
      mb: 4,
      mx: 'auto',
    },
    contactCard: {
      p: 2,
      mb: 2,
      height: '90%',
      textAlign: i18n.language === 'ar' ? 'right' : 'left',
      pl: i18n.language === 'ar' ? 0 : 3,
      pr: i18n.language === 'ar' ? 3 : 0,
    },
    submitButton: {
      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      color: 'white',
    },
    pageWrapper: {
      bgcolor: 'white',
    },
  };

  return (
    <Box sx={styles.pageWrapper}>
      <Paper elevation={0} sx={styles.paper}>
        <Fade in timeout={800}>
          <Box textAlign="center" mb={6}>
            <Typography variant="h3" component="h1" gutterBottom sx={styles.title}>
              {t('title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={styles.subtitle}>
              {t('subtitle')}
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} mt={2}>
          {/* Left: Company Info */}

          <Grid size={{ xs: 12, md: 6 }}>
            <Fade in timeout={1000}>
              <Card elevation={8} sx={styles.contactCard}>
                <Stack spacing={2}>
                  <Typography variant="h6">{t('contact.info')}</Typography>
                  <Divider flexItem />

                  <Stack
                    direction={i18n.language === 'ar' ? 'row-reverse' : 'row'}
                    alignItems="center"
                    spacing={1}
                  >
                    <LocationOnIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.address')}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={i18n.language === 'ar' ? 'row-reverse' : 'row'}
                    alignItems="center"
                    spacing={1}
                  >
                    <PhoneIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.phone')}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={i18n.language === 'ar' ? 'row-reverse' : 'row'}
                    alignItems="center"
                    spacing={1}
                  >
                    <EmailIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.email')}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={i18n.language === 'ar' ? 'row-reverse' : 'row'}
                    alignItems="center"
                    spacing={1}
                  >
                    <AccessTimeIcon sx={{ color: theme.palette.primary.main }} />
                    <Typography variant="body2" color="text.secondary">
                      {t('contact.workingHours')}
                    </Typography>
                  </Stack>
                </Stack>
              </Card>
            </Fade>
          </Grid>

          {/* Right: Form */}

          <Grid size={{ xs: 12, md: 6 }}>
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('form.fullName')}
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t('placeholders.fullName')}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={t('form.email')}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('placeholders.email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label={t('form.phone')}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('placeholders.phone')}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('form.subject')}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t('placeholders.subject')}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('form.message')}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('placeholders.message')}
                    multiline
                    rows={4}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button variant="contained" type="submit" fullWidth sx={styles.submitButton}>
                    {t('form.submit')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ContactUs;
