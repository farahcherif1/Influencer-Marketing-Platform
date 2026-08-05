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
import { createTitle } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface TitleStepProps extends mediumStepProps {
  initialTitle?: string;
  onTitleChange?: (title: string) => void;
}

export default function TitleStep({
  onContinue,
  onBack,
  userId,
  initialTitle = '',
  onTitleChange,
}: TitleStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState('');

  // keep local state in sync with parent
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleContinue = async () => {
    if (title.trim().length < 20) {
      setError(t('titleStep.error'));
    } else {
      try {
        await createTitle(userId, title);
        if (onTitleChange) {
          onTitleChange(title);
        }
        onContinue();
      } catch (error) {
        console.error('Failed to create title:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setError('');
    if (onTitleChange) {
      onTitleChange(value);
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
          value={20}
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
        sx={{ fontSize: { xs: '1.2rem', sm: '1.75rem' } }}
      >
        {t('titleStep.title')}
      </Typography>

      {/* Input */}
      <TextField
        placeholder={t('titleStep.placeholder')}
        variant="outlined"
        fullWidth
        value={title}
        onChange={handleChange}
        error={Boolean(error)}
        helperText={error}
        sx={{
          mb: { xs: 3, sm: 5 },
          fontSize: '1.25rem',
          '& .MuiInputBase-root': {
            height: { xs: 52, sm: 64 },
            fontSize: { xs: '1rem', sm: '1.2rem' },
            padding: { xs: '8px', sm: '12px' },
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
