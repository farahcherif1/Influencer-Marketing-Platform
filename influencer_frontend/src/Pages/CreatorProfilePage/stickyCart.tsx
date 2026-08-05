import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  useTheme,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@mui/material';
import type { CreatorService } from '../../Types/Creator';
import { useCart } from '../../Context/useCart';
import { useUser } from '../../Context/useUser';

type StickyCartProps = {
  packages: CreatorService[];
  selectedPackage: string;
  onPackageSelect: (packageId: string) => void;
  onAddToCart?: (item: { creatorServiceId: number; cartId: number }) => void;
  mobileMode?: boolean;
};

const StickyCart: React.FC<StickyCartProps> = ({
  packages,
  selectedPackage,
  onPackageSelect,
  onAddToCart,
  mobileMode,
}) => {
  const theme = useTheme();
  const { t } = useTranslation('profile');
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { cart } = useCart();
  const { user } = useUser();

  const getImageByType = (platform?: string) => {
    switch (platform) {
      case 'Instagram':
        return '/assets/instagram.svg';
      case 'Tiktok':
        return '/assets/tiktok.svg';
      case 'UGC':
        return '/assets/ugc.svg';
      case 'YouTube':
        return '/assets/youtube.svg';
      case 'Twitter':
        return '/assets/twitter.svg';
      default:
        return '/assets/ugc.svg';
    }
  };

  const handleSelect = (event: SelectChangeEvent<string>) => {
    onPackageSelect(event.target.value);
  };

  const selectedPackageData = packages.find((pkg) => pkg.id === Number(selectedPackage));

  const styles = {
    paper: {
      p: 2,
      bgcolor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      mb: 2,
      width: '450px',
    },
  };
  if (mobileMode) {
    return (
      <Box
        sx={{
          p: 1,
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxHeight: 100,
          overflow: 'hidden',
          gap: 1,
        }}
      >
        <Box display="flex" flexDirection="column" gap={2} mb={2}>
          <Typography fontWeight={600} fontSize={16} color={theme.palette.text.primary}>
            ${selectedPackageData?.price}
          </Typography>
          <Box display="flex" flexDirection="row">
            <FormControl fullWidth size="small">
              <InputLabel>{t('profile.selectPackage')}</InputLabel>
              <Select
                value={selectedPackage}
                label={t('profile.selectPackage')}
                onChange={handleSelect}
                sx={{ width: '500px' }}
              >
                {packages.map((pkg) => (
                  <MenuItem key={pkg.id} value={pkg.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src={getImageByType(pkg.service.platform)}
                        alt={pkg.service.platform}
                        style={{ width: 20, height: 20 }}
                      />
                      {pkg.quantity} {pkg.service.name} ({pkg.duration} {pkg.durationUnit})
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Add to cart */}
            {user?.role === 'brand' && (
              <Button
                fullWidth
                variant="contained"
                size="medium"
                sx={{
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  width: '150px',
                  '&:hover': {
                    opacity: 0.9,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
                onClick={() => {
                  if (
                    selectedPackageData?.id !== undefined &&
                    cart?.id !== undefined &&
                    onAddToCart
                  ) {
                    onAddToCart({ creatorServiceId: selectedPackageData.id, cartId: cart.id });
                  }
                }}
              >
                {t('profile.addToCart')}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Paper elevation={2} variant="outlined" sx={styles.paper}>
      <Box
        sx={{
          flex: 1,
          position: { md: 'sticky' },
          top: { md: 80 },
          alignSelf: 'flex-start',
          width: '100%',
        }}
      >
        <Typography fontWeight={600} fontSize={18}>
          ${selectedPackageData?.price}
        </Typography>

        {isDesktop && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {selectedPackageData?.description}
          </Typography>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('profile.selectPackage')}</InputLabel>
          <Select value={selectedPackage} label="Select Package" onChange={handleSelect}>
            {packages.map((pkg) => (
              <MenuItem key={pkg.id} value={pkg.id}>
                <Box display="flex" alignItems="center" gap={2}>
                  <img
                    src={getImageByType(pkg.service.platform)}
                    alt={pkg.service.platform}
                    style={{ width: 22, height: 22 }}
                  />
                  {pkg.quantity} {pkg.service.name}{' '}
                  {pkg.duration && ` (${pkg.duration} ${pkg.durationUnit})`}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {user?.role === 'brand' && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              fontWeight: 600,
              mb: 2,
              '&:hover': {
                opacity: 0.9,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              },
            }}
            onClick={() => {
              if (selectedPackageData?.id !== undefined && cart?.id !== undefined && onAddToCart) {
                onAddToCart({ creatorServiceId: selectedPackageData.id, cartId: cart.id });
              }
            }}
          >
            {t('profile.addToCart')}
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default StickyCart;
