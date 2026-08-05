import { Box, Button, Typography, LinearProgress, useTheme, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

export default function LastStep({ onBack, onContinue }: mediumStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        mt: { xs: 12, sm: 7 },
        px: { xs: '20px', sm: '32px', md: '80px' },
        py: { xs: '24px', sm: '40px', md: '60px' },
        direction: direction,
      }}
    >
      {/* Progress */}
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            height: { xs: 8, md: 10 },
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      {/* Back Button */}
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: { xs: 0.75, md: 1 },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <ArrowBackIosNewIcon
            fontSize="small"
            sx={{
              color: theme.palette.text.primary,
              fontSize: { xs: '1rem', md: '1.25rem' },
            }}
          />
        </IconButton>
      </Box>

      {/* Heading */}
      <Typography
        variant="h4"
        fontWeight={700}
        mb={{ xs: 2.5, md: 4 }}
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        {t('lastStep.title')}
      </Typography>

      <Typography
        variant="body1"
        mb={{ xs: 3, md: 4 }}
        sx={{
          color: theme.palette.text.secondary,
          fontSize: { xs: '0.95rem', sm: '1rem', md: '1rem' },
          lineHeight: { xs: 1.6, md: 1.5 },
        }}
      >
        {t('lastStep.description')}
      </Typography>

      <Button
        fullWidth
        onClick={onContinue}
        variant="contained"
        sx={{
          mt: { xs: 3, md: 4 },
          py: { xs: '14px', md: '16px' },
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          fontWeight: 600,
          borderRadius: { xs: '8px', md: '10px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
