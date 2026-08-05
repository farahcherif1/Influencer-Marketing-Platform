import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Button,
  Typography,
  LinearProgress,
  useTheme,
  IconButton,
  MenuItem,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { durationUnits } from '../../enums/Creator-enums';
import { createCreatorService } from '../../services/completeProfileService';
import { getServices, getSocialChannelsByCreatorId } from '../../services/creator.service';
import type { Service, CreatePackage, mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

type ContentPackageStepProps = mediumStepProps & {
  initialPackages?: CreatePackage[];
  onPackagesChange?: (packages: CreatePackage[]) => void;
};

export default function ContentPackageStep({
  userId,
  onContinue,
  onBack,
  initialPackages,
  onPackagesChange,
}: ContentPackageStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const [packages, setPackages] = useState<CreatePackage[]>(
    initialPackages && initialPackages.length > 0
      ? initialPackages
      : [
          {
            id: 1,
            serviceId: '',
            quantity: '',
            duration: '',
            durationUnit: '',
            price: '',
            description: '',
            showDescription: false,
          },
        ],
  );

  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState('');
  const [, setPackageError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchServicesAndChannels = async () => {
      try {
        const [servicesData, socialChannels] = await Promise.all([
          getServices(),
          getSocialChannelsByCreatorId(userId),
        ]);
        const creatorPlatforms = socialChannels.map((sc: Service) => sc.platform);
        const filteredServices = servicesData.filter(
          (service: Service) =>
            service.platform === 'UGC' || creatorPlatforms.includes(service.platform),
        );

        setServices(filteredServices);

        // Validate and reset invalid serviceIds
        const validServiceIds = filteredServices.map((s: Service) => s.id);
        setPackages((prev) =>
          prev.map((pkg) => ({
            ...pkg,
            serviceId: validServiceIds.includes(Number(pkg.serviceId)) ? pkg.serviceId : '',
          })),
        );

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to fetch services or social channels', error);
      }
    };

    fetchServicesAndChannels();
  }, [userId]);

  // Sync changes to parent component only after initialization
  useEffect(() => {
    if (isInitialized) {
      onPackagesChange?.(packages);
    }
  }, [packages, isInitialized]);

  const handleAddPackage = () => {
    setPackages([
      ...packages,
      {
        id: Date.now(),
        serviceId: '',
        quantity: '',
        duration: '',
        durationUnit: '',
        price: '',
        description: '',
        showDescription: false,
      },
    ]);
  };

  const handleRemovePackage = (id: number) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const handleChange = (
    id: number,
    field: keyof CreatePackage,
    value: string | number | boolean,
  ) => {
    setPackages((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const handleContinue = async () => {
    const hasError = packages.some(
      (p) => !p.serviceId || !p.quantity || !p.price || Number(p.price) < 50,
    );
    if (hasError) {
      setError(t('contentPackageStep.error') || 'Price must be at least $50');
      return;
    }

    setError('');

    try {
      await Promise.all(
        packages.map((p) => {
          const selectedService = services.find((s) => s.id === p.serviceId);
          const showDuration = selectedService ? selectedService.hasDuration : false;

          const payload: {
            serviceId: number;
            quantity: number;
            price: number;
            description: string;
            duration?: number;
            durationUnit?: string;
          } = {
            serviceId: Number(p.serviceId),
            quantity: Number(p.quantity),
            price: Number(p.price),
            description: p.description,
          };

          if (showDuration) {
            if (p.duration) payload.duration = Number(p.duration);
            if (p.durationUnit) payload.durationUnit = p.durationUnit;
          }

          return createCreatorService(userId, payload);
        }),
      );

      onContinue();
    } catch (err) {
      console.error('Failed to create services:', err);
      setPackageError(t('contentPackageStep.packageError'));
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
        mt: { xs: 12, sm: 7 },
      }}
    >
      {/* Progress */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={80}
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
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
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
        sx={{
          fontSize: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        {t('contentPackageStep.title')}
      </Typography>

      <Typography
        variant="body1"
        mb={{ xs: 3, sm: 4 }}
        sx={{
          color: theme.palette.text.secondary,
          fontSize: { xs: '0.938rem', sm: '1rem' },
        }}
      >
        {t('contentPackageStep.description')}
        <a
          href="#"
          style={{
            textDecoration: 'underline',
            color: theme.palette.text.primary,
          }}
        >
          {t('contentPackageStep.rateCalculator')}
        </a>
        {t('contentPackageStep.fee')}
      </Typography>

      {/* Packages */}
      <Box display="flex" flexDirection="column" gap={{ xs: 3, sm: 4 }}>
        {packages.map((pkg, index) => {
          const selectedService = services.find((s) => s.id === pkg.serviceId);
          const showDuration = selectedService ? selectedService.hasDuration : false;

          return (
            <Box
              key={pkg.id}
              sx={{
                border: '1px solid #ddd',
                borderRadius: { xs: 3, sm: 4 },
                p: { xs: 2, sm: 3 },
                backgroundColor: '#fafafa',
                position: 'relative',
              }}
            >
              {/* Inputs */}
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                <TextField
                  select
                  label={t('contentPackageStep.contentType')}
                  value={services.some((s) => s.id === pkg.serviceId) ? pkg.serviceId : ''}
                  onChange={(e) => handleChange(pkg.id, 'serviceId', Number(e.target.value))}
                  fullWidth
                  sx={{
                    minWidth: { xs: '100%', sm: 200 },
                    '& .MuiSelect-icon': {
                      color: theme.palette.text.primary,
                      fontSize: '1.5rem',
                    },
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.938rem', sm: '1rem' },
                    },
                  }}
                >
                  {services.map((service) => (
                    <MenuItem
                      key={service.id}
                      value={service.id}
                      sx={{ fontSize: { xs: '0.938rem', sm: '1rem' } }}
                    >
                      {t(`contentPackageStep.services.${service.name}`)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label={t('contentPackageStep.quantity')}
                  type="number"
                  value={pkg.quantity}
                  onChange={(e) => handleChange(pkg.id, 'quantity', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.938rem', sm: '1rem' },
                    },
                  }}
                />
              </Box>

              {/* Conditionally show Duration fields */}
              {showDuration && (
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
                  <TextField
                    label={t('contentPackageStep.duration')}
                    type="number"
                    value={pkg.duration}
                    onChange={(e) => handleChange(pkg.id, 'duration', e.target.value)}
                    fullWidth
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: { xs: '0.938rem', sm: '1rem' },
                      },
                    }}
                  />
                  <TextField
                    select
                    label={t('contentPackageStep.unit')}
                    value={
                      durationUnits.some((u) => u.value === pkg.durationUnit)
                        ? pkg.durationUnit
                        : ''
                    }
                    onChange={(e) => handleChange(pkg.id, 'durationUnit', e.target.value)}
                    sx={{
                      minWidth: { xs: '100%', sm: 150 },
                      '& .MuiSelect-icon': {
                        color: theme.palette.text.primary,
                        fontSize: '1.5rem',
                      },
                      '& .MuiInputBase-root': {
                        fontSize: { xs: '0.938rem', sm: '1rem' },
                      },
                    }}
                  >
                    {durationUnits.map(({ label, value }) => (
                      <MenuItem
                        key={value}
                        value={value}
                        sx={{ fontSize: { xs: '0.938rem', sm: '1rem' } }}
                      >
                        {t(`contentPackageStep.durationUnits.${label}`)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              )}

              <TextField
                label={t('contentPackageStep.price')}
                type="number"
                value={pkg.price}
                onChange={(e) => {
                  handleChange(pkg.id, 'price', e.target.value);
                }}
                inputProps={{ min: 50 }}
                fullWidth
                error={pkg.price !== '' && Number(pkg.price) < 50}
                helperText={
                  pkg.price !== '' && Number(pkg.price) < 50
                    ? t('contentPackageStep.minPriceError')
                    : ''
                }
                sx={{
                  mb: 2,
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.938rem', sm: '1rem' },
                  },
                }}
              />

              {!pkg.showDescription ? (
                <Typography
                  variant="body2"
                  sx={{
                    cursor: 'pointer',
                    color: theme.palette.text.primary,
                    textDecoration: 'underline',
                    fontWeight: 500,
                    fontSize: { xs: '0.875rem', sm: '0.938rem' },
                  }}
                  onClick={() => handleChange(pkg.id, 'showDescription', true)}
                >
                  {t('contentPackageStep.addDescription')}
                </Typography>
              ) : (
                <TextField
                  label={t('contentPackageStep.des')}
                  multiline
                  rows={2}
                  value={pkg.description}
                  onChange={(e) => handleChange(pkg.id, 'description', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.938rem', sm: '1rem' },
                    },
                  }}
                />
              )}

              {index > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    mt: 2,
                    cursor: 'pointer',
                    fontWeight: 500,
                    textAlign: 'right',
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.875rem', sm: '0.938rem' },
                  }}
                  onClick={() => handleRemovePackage(pkg.id)}
                >
                  {t('contentPackageStep.removePackage')}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Add package - bottom right */}
      <Box display="flex" justifyContent="flex-end" mt={{ xs: 2, sm: 3 }}>
        <Typography
          variant="body1"
          sx={{
            cursor: 'pointer',
            color: theme.palette.text.primary,
            fontWeight: 600,
            textDecoration: 'underline',
            fontSize: { xs: '0.938rem', sm: '1rem' },
          }}
          onClick={handleAddPackage}
        >
          {t('contentPackageStep.addPackage')}
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Typography color="error" mt={2} sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
          {error}
        </Typography>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        fullWidth
        variant="contained"
        sx={{
          mt: { xs: 3, sm: 2 },
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
