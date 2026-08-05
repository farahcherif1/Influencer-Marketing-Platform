import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  useTheme,
  LinearProgress,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import IconButton from '@mui/material/IconButton';
import { GenderOptions } from '../../enums/Creator-enums';
import { createGender } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface GenderStepProps extends mediumStepProps {
  initialGender?: string;
  onGenderChange?: (gender: string) => void;
}

export default function GenderStep({
  onContinue,
  onBack,
  userId,
  initialGender = '',
  onGenderChange,
}: GenderStepProps) {
  const [gender, setGender] = useState(initialGender);
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  useEffect(() => {
    setGender(initialGender);
  }, [initialGender]);

  const handleContinue = async () => {
    if (gender) {
      try {
        await createGender(userId, gender);
        onGenderChange?.(gender);
        onContinue();
      } catch (error) {
        console.error('Failed to create gender:', error);
      }
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
      {/* Progress bar */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={40}
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
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>

      {/* Step title */}
      <Typography
        variant="h3"
        fontWeight={700}
        mb={{ xs: 3, sm: 4 }}
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        {t('genderStep.title')}
      </Typography>

      {/* Gender options */}
      <RadioGroup
        value={gender}
        onChange={(e) => {
          setGender(e.target.value);
          onGenderChange?.(e.target.value);
        }}
      >
        {GenderOptions.map((option) => (
          <Box
            key={option.value}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
              px: { xs: 1.5, sm: 2 },
              py: { xs: 1, sm: 1.5 },
              borderRadius: 2,
              border: '1px solid #ccc',
              cursor: 'pointer',
              '&:hover': {
                borderColor: theme.palette.primary.main,
              },
            }}
            onClick={() => {
              setGender(option.value);
              onGenderChange?.(option.value);
            }}
          >
            <FormControlLabel
              value={option.value}
              control={<Radio />}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: { xs: '0.938rem', sm: '1rem' } }}>
                    {t(`genderStep.options.${option.value}`)}
                  </Typography>
                </Box>
              }
              sx={{ flexGrow: 1 }}
            />
          </Box>
        ))}
      </RadioGroup>

      {/* Continue button */}
      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: { xs: '12px', sm: '16px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: { xs: '1rem', sm: '1.2rem' },
          borderRadius: { xs: '8px', sm: '10px' },
          boxShadow: 'none',
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
