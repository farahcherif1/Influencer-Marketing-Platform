'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  useTheme,
  IconButton,
  MenuItem,
  TextField,
  CircularProgress,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { createPhoneNumber } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import type { CountryEntry } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface PhoneNumberStepProps extends mediumStepProps {
  initialPhoneNumber: string;
  onPhoneNumberChange: (phone: string) => void;
}

export default function PhoneNumberStep({
  userId,
  onContinue,
  onBack,
  initialPhoneNumber,
  onPhoneNumberChange,
}: PhoneNumberStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const [countries, setCountries] = useState<CountryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<CountryEntry | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(
      'https://gist.githubusercontent.com/anubhavshrimal/75f6183458db8c453306f93521e93d37/raw/CountryCodes.json',
    )
      .then((res) => res.json())
      .then((data: CountryEntry[]) => {
        setCountries(data);
        const fr = data.find((c) => c.code === 'FR') ?? data[0];
        setCountry(fr);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleContinue = async () => {
    const fullNumber = country ? country.dial_code + initialPhoneNumber : initialPhoneNumber;
    const parsed = parsePhoneNumberFromString(fullNumber);
    if (!parsed || !parsed.isValid()) {
      setError(t('phoneNumberStep.invalidNumber'));
    } else {
      setError('');
      setLoading(true);
      try {
        await createPhoneNumber(userId, parsed.number);
      } catch (err) {
        console.error('Error saving phone number:', err);
      } finally {
        setLoading(false);
      }
      onContinue();
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          width: '100%',
          height: 200,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          direction,
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 1000 },
        px: { xs: '20px', sm: '80px' },
        py: { xs: '24px', sm: '60px' },
        mt: { xs: 12, sm: 7 },
      }}
    >
      {/* Progress */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={90}
          sx={{
            height: { xs: 6, sm: 10 },
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      {/* Back Button */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: { xs: 0.75, sm: 1 },
            '&:hover': { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>

      {/* Heading */}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={{ xs: 3, sm: 4 }}
        sx={{ fontSize: { xs: '1.2rem', sm: '2rem' } }}
      >
        {t('phoneNumberStep.title')}
      </Typography>

      {/* Inputs */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', sm: 'row' }}
        gap={2}
        mb={error ? 1 : { xs: 3, sm: 4 }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          select
          value={country?.code}
          onChange={(e) => {
            const sel = countries.find((c) => c.code === e.target.value);
            if (sel) setCountry(sel);
          }}
          fullWidth
        >
          {countries.map((c) => (
            <MenuItem key={c.code} value={c.code}>
              {c.name} ({c.dial_code})
            </MenuItem>
          ))}
        </TextField>

        <TextField
          placeholder={t('phoneNumberStep.placeholder')}
          value={initialPhoneNumber}
          onChange={(e) => onPhoneNumberChange(e.target.value.replace(/\D/g, ''))}
          fullWidth
        />
      </Box>

      {/* Validation Error */}
      {error && (
        <Typography color="error" mb={3}>
          {error}
        </Typography>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        fullWidth
        variant="contained"
        sx={{
          py: { xs: '12px', sm: '16px' },
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 600,
          borderRadius: { xs: '8px', sm: '10px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          boxShadow: 'none',
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
