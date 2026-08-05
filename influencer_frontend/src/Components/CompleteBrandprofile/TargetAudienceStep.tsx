import { Box, Button, Typography, useTheme, LinearProgress, IconButton } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { platformOptions } from '../../enums/Brand-enums';
import { updateBrandStep } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface TargetAudienceStepProps extends mediumStepProps {
  initialSelectedPlatforms?: string[];
  onSelectedPlatformsChange?: (platforms: string[]) => void;
}

export default function TargetAudienceStep({
  userId,
  onContinue,
  onBack,
  initialSelectedPlatforms = [],
  onSelectedPlatformsChange,
}: TargetAudienceStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('brandSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  // Controlled value from parent
  const selectedPlatforms = initialSelectedPlatforms;

  const handleContinue = async () => {
    if (selectedPlatforms.length === 0) return;

    try {
      await updateBrandStep(userId, { targetPlatforms: selectedPlatforms });
      onContinue();
    } catch (error) {
      console.error('Failed to update target audience:', error);
    }
  };

  const handlePlatformClick = (platformValue: string) => {
    const updatedPlatforms = selectedPlatforms.includes(platformValue)
      ? selectedPlatforms.filter((p) => p !== platformValue)
      : [...selectedPlatforms, platformValue].slice(0, 3); // limit to 3 selections

    onSelectedPlatformsChange?.(updatedPlatforms);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        px: { xs: '20px', sm: '32px' },
        direction: direction,
        mt: { xs: 15, sm: 14 },
      }}
    >
      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <LinearProgress
          variant="determinate"
          value={66.66}
          sx={{
            height: { xs: 5, md: 6 },
            borderRadius: 10,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: { xs: 0.75, md: 1 },
            '&:hover': { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ArrowBackIosNewIcon
            fontSize="small"
            sx={{ color: theme.palette.text.primary, fontSize: { xs: '1rem', md: '1.25rem' } }}
          />
        </IconButton>
      </Box>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={{ xs: 2.5, md: 2 }}
        sx={{ fontSize: { xs: '1.4rem', sm: '1.75rem' } }}
      >
        {t('targetAudienceStep.title')}
      </Typography>

      <Box sx={{ display: 'grid', gap: { xs: 1.5, md: 2 }, mb: { xs: 3, md: 4 } }}>
        {platformOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedPlatforms.includes(option.value) ? 'contained' : 'outlined'}
            onClick={() => handlePlatformClick(option.value)}
            sx={{
              textTransform: 'none',
              justifyContent: 'flex-start',
              py: { xs: '10px', md: '12px' },
              px: { xs: '14px', md: '16px' },
              fontSize: { xs: '0.95rem', md: '1rem' },
              borderRadius: { xs: '10px', md: '12px' },
              borderColor: theme.palette.text.secondary,
              color: selectedPlatforms.includes(option.value)
                ? 'white'
                : theme.palette.text.primary,
              backgroundColor: selectedPlatforms.includes(option.value)
                ? theme.palette.text.primary
                : 'transparent',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: selectedPlatforms.includes(option.value)
                  ? theme.palette.text.primary
                  : 'transparent',
              },
            }}
          >
            {t(`targetAudienceStep.platforms.${option.value}`)}
          </Button>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: { xs: '11px', md: '12px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: { xs: '0.95rem', md: '1rem' },
          borderRadius: { xs: '10px', md: '12px' },
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
