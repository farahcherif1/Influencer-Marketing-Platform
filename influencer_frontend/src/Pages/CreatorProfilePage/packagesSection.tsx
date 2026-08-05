import { Box, Card, CardContent, Typography, Tabs, Tab, useTheme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CreatorService } from '../../Types/Creator';

type PackagesSectionProps = {
  packages: CreatorService[];
  selectedPackage?: string;
  onPackageSelect?: (packageId: string) => void;
};

const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  selectedPackage,
  onPackageSelect,
}) => {
  const [tab, setTab] = useState('all');
  const [showMore, setShowMore] = useState<Record<string, boolean>>({});
  const platforms = Array.from(new Set(packages.map((p) => p.service.platform).filter(Boolean)));
  const tabs = ['all', ...platforms];

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  const handlePackageClick = (packageId: number) => {
    if (onPackageSelect) {
      onPackageSelect(packageId.toString());
    }
  };

  const getImageByType = (platform?: string) => {
    switch (platform) {
      case 'instagram':
        return '/assets/instagram.svg';
      case 'tiktok':
        return '/assets/tiktok.svg';
      case 'ugc':
        return '/assets/ugc.svg';
      default:
        return '/assets/ugc.svg';
    }
  };

  const filteredPackages =
    tab === 'all' ? packages : packages.filter((p) => p.service.platform === tab);
  const theme = useTheme();

  const styles = {
    cardContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 2,
    },
  };

  const { t } = useTranslation('profile');

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" fontWeight={700}>
        {t('profile.packages')}
      </Typography>

      <Tabs value={tab} onChange={handleChangeTab} sx={{ mb: 2 }}>
        {tabs.map((platformKey) => (
          <Tab
            key={platformKey}
            value={platformKey}
            label={platformKey === 'all' ? t('profile.all') : platformKey}
          />
        ))}
      </Tabs>

      {filteredPackages.length > 0 ? (
        filteredPackages.map((pkg) => (
          <Card
            key={pkg.id}
            variant="outlined"
            onClick={() => handlePackageClick(pkg.id)}
            sx={{
              borderRadius: 1,
              mb: 2,
              border: '0.5px solid',
              '&:hover': {
                borderColor: 'black',
                cursor: 'pointer',
              },
            }}
          >
            <CardContent sx={styles.cardContent}>
              <Box display="flex" alignItems="center" gap={2}>
                <Box display="flex" flexDirection="column">
                  <Box display="flex" alignItems="center" gap={2}>
                    <img
                      src={getImageByType(pkg.service.platform)}
                      alt={pkg.service.platform}
                      style={{ width: 22, height: 22 }}
                    />

                    <Typography fontWeight="700">
                      {pkg.quantity} {pkg.service.name}{' '}
                      {pkg.duration && ` (${pkg.duration} ${pkg.durationUnit})`}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {showMore[pkg.id]
                      ? pkg.description
                      : `${pkg.description?.slice(0, 100)}${pkg.description && pkg.description.length > 100 ? '...' : ''}`}

                    {pkg.description && pkg.description.length > 100 && (
                      <Typography
                        component="span"
                        sx={{
                          color: theme.palette.text.primary,
                          cursor: 'pointer',
                          ml: 1,
                          textDecoration: 'underline',
                          fontWeight: 200,
                          fontSize: 15,
                        }}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          setShowMore((prev) => ({ ...prev, [pkg.id]: !prev[pkg.id] }));
                        }}
                      >
                        {showMore[pkg.id] ? t('profile.seeLess') : t('profile.seeMore')}
                      </Typography>
                    )}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h6" fontWeight={700}>
                  $ {pkg.price}
                </Typography>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor:
                      selectedPackage === pkg.id.toString()
                        ? theme.palette.primary.main
                        : 'grey.400',
                    bgcolor:
                      selectedPackage === pkg.id.toString() ? theme.palette.primary.main : 'white',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" textAlign="center" sx={{ py: 4, color: 'text.secondary' }}>
          {t('profile.noPackagesAvailable')}
        </Typography>
      )}
    </Box>
  );
};

export default PackagesSection;
