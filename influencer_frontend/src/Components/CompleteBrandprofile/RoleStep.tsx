import { Box, Button, MenuItem, Select, Typography, LinearProgress, useTheme } from '@mui/material';
import { roleOptions } from '../../enums/Brand-enums';
import { updateBrandStep } from '../../services/completeProfileService';
import type { firstStepProps } from '../../Types/Creator';
import { isRtl } from '../../i18n/isRtl';
import { useTranslation } from 'react-i18next';

interface RoleStepProps extends firstStepProps {
  initialRole?: string;
  onRoleChange?: (role: string) => void;
}

export default function RoleStep({
  onContinue,
  userId,
  initialRole = '',
  onRoleChange,
}: RoleStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('brandSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  // Use initialRole as the controlled value
  const role = initialRole;

  const handleContinue = async () => {
    if (!role) return alert(t('roleStep.pleaseSelectRole'));

    try {
      await updateBrandStep(userId, { brandRole: role });
      onContinue();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        px: { xs: '20px', sm: '32px', md: '80px' },
        py: { xs: '24px', sm: '40px', md: '60px' },
        direction: direction,
        mt: { xs: 12, sm: 7 },
      }}
    >
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={16.67}
          sx={{
            height: { xs: 8, md: 10 },
            borderRadius: 10,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Typography
        variant="h3"
        fontWeight={700}
        mb={{ xs: 3, md: 4 }}
        sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
      >
        {t('roleStep.title')}
      </Typography>

      <Select
        value={role}
        onChange={(e) => onRoleChange?.(e.target.value)}
        displayEmpty
        fullWidth
        sx={{
          borderRadius: { xs: 1.5, md: 2 },
          mb: { xs: 4, md: 5 },
          bgcolor: 'background.paper',
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
          height: { xs: 54, sm: 60, md: 64 },
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            padding: { xs: '12px', md: '16px' },
          },
          '& .MuiSelect-icon': {
            color: theme.palette.text.primary,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
          },
        }}
      >
        <MenuItem value="" disabled sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}>
          {t('roleStep.selectRole')}
        </MenuItem>
        {roleOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' } }}
          >
            {t(`roleStep.options.${option.value}`)}
          </MenuItem>
        ))}
      </Select>

      <Button
        fullWidth
        variant="contained"
        onClick={handleContinue}
        sx={{
          py: { xs: '14px', md: '16px' },
          fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
          fontWeight: 600,
          borderRadius: { xs: '8px', md: '10px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
