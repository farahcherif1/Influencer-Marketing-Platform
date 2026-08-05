import { useState, useEffect } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Button,
  Typography,
  LinearProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { fetchCities, createLocation } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface LocationStepProps extends mediumStepProps {
  initialLocation?: string;
  onLocationChange?: (location: string) => void;
}

export default function LocationStep({
  onContinue,
  onBack,
  userId,
  initialLocation = '',
  onLocationChange,
}: LocationStepProps) {
  const theme = useTheme();
  const [options, setOptions] = useState<string[]>([]);
  const [location, setLocation] = useState(initialLocation);
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  // Sync local state with parent
  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleContinue = async () => {
    if (!location) {
      alert(t('locationStep.alert.empty', 'Please select a location'));
      return;
    }
    try {
      await createLocation(userId, location);
      if (onLocationChange) {
        onLocationChange(location);
      }
      onContinue();
    } catch (error) {
      console.error('Failed to create location:', error);
    }
  };

  const handleInputChange = async (val: string) => {
    const results = await fetchCities(val);
    setOptions(results);
  };

  const handleSelect = (value: string) => {
    setLocation(value);
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 1000 },
        px: { xs: '20px', sm: '80px' },
        py: { xs: '24px', sm: '60px' },
        direction: direction,
        mt: { xs: 10, sm: 7 },
      }}
    >
      {/* Progress */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={10}
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

      {/* Back button */}
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

      {/* Title */}
      <Typography
        variant="h3"
        fontWeight={700}
        mb={{ xs: 3, sm: 4 }}
        sx={{ fontSize: { xs: '1.2rem', sm: '2rem' } }}
      >
        {t('locationStep.title')}
      </Typography>

      {/* Location input */}
      <Autocomplete
        freeSolo
        value={location}
        options={options}
        onInputChange={(_, val) => handleInputChange(val)}
        onChange={(_, value) => handleSelect(value || '')}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t('locationStep.placeholder')}
            variant="outlined"
            sx={{
              fontSize: '1.25rem',
              '& .MuiInputBase-root': {
                height: { xs: 52, sm: 64 },
                fontSize: { xs: '1rem', sm: '1.2rem' },
                padding: { xs: '8px', sm: '12px' },
              },
            }}
          />
        )}
        sx={{ mb: { xs: 3, sm: 5 } }}
      />

      {/* Continue button */}
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
