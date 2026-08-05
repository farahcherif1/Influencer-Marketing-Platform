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
import { budgetOptions } from '../../enums/Brand-enums';
import { updateBrandStep } from '../../services/completeProfileService';
import { mapBudgetToNumber } from '../../utils/formatFollowersNumber';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface AnnualBudgetStepProps extends mediumStepProps {
  initialAnnualBudget?: string;
  onAnnualBudgetChange?: (budget: string) => void;
}

export default function AnnualBudgetStep({
  userId,
  onContinue,
  onBack,
  initialAnnualBudget = '',
  onAnnualBudgetChange,
}: AnnualBudgetStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('brandSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  // Controlled value from parent
  const budget = initialAnnualBudget;

  const handleContinue = async () => {
    if (!budget) return;

    try {
      await updateBrandStep(userId, { annualBudget: mapBudgetToNumber(budget) });
      onContinue();
    } catch (error) {
      console.error('Failed to update annual budget:', error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500, px: 2, direction: direction, mt: 15 }}>
      <Box sx={{ mb: 1.5 }}>
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            height: 4,
            borderRadius: 8,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 1.5 }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: 0.5,
            '&:hover': { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ArrowBackIosNewIcon
            fontSize="small"
            sx={{ color: theme.palette.text.primary, fontSize: '1rem' }}
          />
        </IconButton>
      </Box>

      <Typography variant="h5" fontWeight="bold" mb={1} color="#000000">
        {t('annualBudgetStep.title')}
      </Typography>

      <RadioGroup value={budget} onChange={(e) => onAnnualBudgetChange?.(e.target.value)}>
        {budgetOptions.map((option) => (
          <Box
            key={option.value}
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 1,
              px: 1.5,
              py: 1,
              borderRadius: 2,
              border: '1px solid #ccc',
              cursor: 'pointer',
              '&:hover': { borderColor: theme.palette.primary.main },
            }}
            onClick={() => onAnnualBudgetChange?.(option.value)}
          >
            <FormControlLabel
              value={option.value}
              control={<Radio size="small" sx={{ p: 0.75 }} />}
              label={
                <Typography variant="body1">
                  {t(`annualBudgetStep.options.${option.value}`)}
                </Typography>
              }
              sx={{ flexGrow: 1, m: 0 }}
            />
          </Box>
        ))}
      </RadioGroup>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: '12px',
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '1rem',
          borderRadius: '12px',
          boxShadow: 'none',
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
