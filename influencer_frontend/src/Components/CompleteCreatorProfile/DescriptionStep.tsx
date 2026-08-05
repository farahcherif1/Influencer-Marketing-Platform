import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Button,
  Typography,
  LinearProgress,
  useTheme,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { createDescription } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface DescriptionStepProps extends mediumStepProps {
  initialDescription?: string;
  onDescriptionChange?: (description: string) => void;
}

export default function DescriptionStep({
  onContinue,
  onBack,
  userId,
  initialDescription = '',
  onDescriptionChange,
}: DescriptionStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);

  const handleContinue = async () => {
    if (description.trim().length < 100) {
      setError(t('descriptionStep.error'));
    } else {
      try {
        await createDescription(userId, description);
        onDescriptionChange?.(description);
        onContinue();
      } catch (error) {
        console.error('Failed to create description:', error);
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
          value={30}
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

      {/* Title */}
      <Typography
        variant="h3"
        fontWeight={700}
        mb={{ xs: 3, sm: 4 }}
        sx={{ fontSize: { xs: '1.2rem', sm: '2rem' } }}
      >
        {t('descriptionStep.title')}
      </Typography>

      {/* Input field */}
      <TextField
        placeholder={t('descriptionStep.placeholder')}
        multiline
        minRows={6}
        fullWidth
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          onDescriptionChange?.(e.target.value);
        }}
        error={Boolean(error)}
        helperText={error}
        sx={{
          mb: { xs: 3, sm: 5 },
          fontSize: '1.25rem',
          '& .MuiInputBase-root': {
            fontSize: { xs: '1rem', sm: '1.2rem' },
            padding: { xs: '8px', sm: '12px' },
          },
          '& .MuiInputLabel-root': {
            fontSize: { xs: '1rem', sm: '1.2rem' },
          },
        }}
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
