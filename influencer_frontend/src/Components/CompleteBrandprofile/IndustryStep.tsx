import {
  Box,
  Button,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  useTheme,
  LinearProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { industryOptions } from '../../enums/Brand-enums';
import { updateBrandStep } from '../../services/completeProfileService';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface IndustryStepProps extends mediumStepProps {
  initialIndustry?: string;
  onIndustryChange?: (industry: string) => void;
}

export default function IndustryStep({
  userId,
  onContinue,
  onBack,
  initialIndustry = '',
  onIndustryChange,
}: IndustryStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('brandSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  // Controlled value from parent
  const industry = initialIndustry;

  const handleContinue = async () => {
    if (!industry) return;

    try {
      await updateBrandStep(userId, { industry });
      onContinue();
    } catch (error) {
      console.error('Failed to update industry:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 800,
        px: { xs: '20px', sm: '32px', md: '40px' },
        direction: direction,
        mt: { xs: 15, sm: 15 },
      }}
    >
      <Box sx={{ mb: { xs: 2.5, md: 3 } }}>
        <LinearProgress
          variant="determinate"
          value={33.33}
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
        mb={{ xs: 0.75, md: 1 }}
        sx={{ fontSize: { xs: '1.2rem', sm: '1.75rem' } }}
      >
        {t('industryStep.title')}
      </Typography>

      <Typography
        variant="h5"
        fontWeight={500}
        mb={{ xs: 2.5, md: 3 }}
        sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
      >
        {t('industryStep.subtitle')}
      </Typography>

      <RadioGroup value={industry} onChange={(e) => onIndustryChange?.(e.target.value)}>
        {industryOptions.map((option) => (
          <Box
            key={option.value}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: { xs: 1.5, md: 2 },
              px: { xs: 1.5, md: 2 },
              py: { xs: 1.25, md: 1.5 },
              borderRadius: { xs: 1.5, md: 2 },
              border: '1px solid #ccc',
              cursor: 'pointer',
              '&:hover': { borderColor: theme.palette.primary.main },
            }}
            onClick={() => onIndustryChange?.(option.value)}
          >
            <FormControlLabel
              value={option.value}
              control={
                <Radio
                  sx={{ '& .MuiSvgIcon-root': { fontSize: { xs: '1.25rem', md: '1.5rem' } } }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, md: 1 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      '& svg': { fontSize: { xs: '1.25rem', md: '1.5rem' } },
                    }}
                  >
                    {option.icon}
                  </Box>
                  <Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}>
                    {t(`industryStep.options.${option.value}`)}
                  </Typography>
                </Box>
              }
              sx={{ flexGrow: 1, margin: 0 }}
            />
          </Box>
        ))}
      </RadioGroup>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: { xs: '11px', md: '12px' },
          mt: { xs: 1, md: 0 },
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
