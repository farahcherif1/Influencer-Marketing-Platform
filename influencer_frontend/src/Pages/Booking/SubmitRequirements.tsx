import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Avatar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import EmptyNavbar from '../../Components/Navbar/EmptyNavbar';
import theme from '../../theme';
import { useCart } from '../../Context/useCart';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createBookingItem } from '../../services/brandService';
import { getMediaByCreator } from '../../services/ImagesService';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

export default function SubmitRequirements() {
  const { itemIndex } = useParams<{ itemIndex: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = (location.state as { bookingId: number }) || {};
  const { cart, clearCart } = useCart();
  const [mediaMap, setMediaMap] = useState<{ [creatorId: number]: string }>({});

  const [productDescription, setProductDescription] = useState('');
  const [contentRequirements, setContentRequirements] = useState('');
  const [contentApproval, setContentApproval] = useState(false);
  const [physicalProduct, setPhysicalProduct] = useState(false);
  const [productCost, setProductCost] = useState('');
  const [useForAds, setUseForAds] = useState(false);
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);

  const { t, i18n } = useTranslation('submitRequirements');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const index = itemIndex ? parseInt(itemIndex) - 1 : 0;
  const currentItem = cart?.cartItems[index];
  const resetForm = () => {
    setProductDescription('');
    setContentRequirements('');
    setContentApproval(false);
    setPhysicalProduct(false);
    setProductCost('');
    setUseForAds(false);
    setAdditionalRequirements('');
    setDeliveryDate(null);

    document.getElementById('productDescription')?.focus();
  };

  const handleSubmit = async () => {
    if (!bookingId || !currentItem) return;

    try {
      await createBookingItem(bookingId, {
        creatorServiceId: currentItem.creatorService.id,
        quantity: currentItem.creatorService.quantity,
        unitPrice: currentItem.creatorService.price,
        productDescription,
        contentRequirements,
        contentApproval,
        physicalProduct,
        productCost: physicalProduct ? Number(productCost) : null,
        useForAds,
        additionalRequirements,
        ...(deliveryDate ? { deliveryDate: deliveryDate.toISOString() } : {}),
      });

      if (index < (cart?.cartItems?.length ?? 0) - 1) {
        resetForm();
        navigate(`/checkout/${index + 2}`, { state: { bookingId } });
      } else {
        await clearCart();
        navigate(`/orders/${bookingId}`);
      }
    } catch (err) {
      console.error('Failed to create booking item', err);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    scrollToTop();
  }, [itemIndex]);
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentItem) return;
      const creatorId = currentItem.creatorService.creator.id;
      if (!mediaMap[creatorId]) {
        const media = await getMediaByCreator(creatorId);
        const profile = media.find((m) => m.type === 'PROFILE_PICTURE');
        setMediaMap((prev) => ({
          ...prev,
          [creatorId]: profile?.url ?? 'https://example.com/default-profile.jpg',
        }));
      }
    };
    fetchProfile();
  }, [currentItem]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: 3, py: 4, direction }}>
        <EmptyNavbar />
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{ color: theme.palette.text.primary, mb: 1, mt: 0 }}
        >
          {t('title')}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
          {t('subtitle')}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            key={currentItem?.creatorService?.creator?.id}
            src={
              mediaMap[currentItem?.creatorService?.creator?.id ?? 0] ??
              'https://example.com/default-profile.jpg'
            }
            sx={{
              width: 60,
              height: 60,
              borderRadius: 1,
            }}
          />
          <Typography variant="h4" fontWeight="600" sx={{ color: theme.palette.text.primary }}>
            {currentItem?.creatorService?.creator?.name}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          fontWeight="600"
          sx={{
            background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1,
            mt: 0,
          }}
        >
          {currentItem?.creatorService?.quantity} {currentItem?.creatorService?.service?.name}{' '}
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {t('describeProduct')}
          </Typography>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder={t('describeProductPlaceholder')}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
                borderRadius: '8px',
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {t('contentRequirements')}
          </Typography>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder={t('contentRequirementsPlaceholder')}
            value={contentRequirements}
            onChange={(e) => setContentRequirements(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#fafafa',
                borderRadius: '8px',
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Select all that apply section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 3,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {t('selectAll')}{' '}
            <span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>
              {' '}
              ({t('optional')})
            </span>
          </Typography>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={contentApproval}
                  onChange={(e) => setContentApproval(e.target.checked)}
                  sx={{
                    color: '#e0e0e0',
                    '&.Mui-checked': {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              }
              label={t('contentApproval')}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  color: theme.palette.text.primary,
                },
                mb: 1,
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={physicalProduct}
                  onChange={(e) => setPhysicalProduct(e.target.checked)}
                  sx={{
                    color: '#e0e0e0',
                    '&.Mui-checked': {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              }
              label={t('physicalProduct')}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  color: theme.palette.text.primary,
                },
                mb: physicalProduct ? 2 : 3,
              }}
            />
          </Box>

          {/* Product cost number field - shows when physical product is checked */}
          {physicalProduct && (
            <Box sx={{ mb: 3 }}>
              <TextField
                type="number"
                fullWidth
                placeholder={t('productCostPlaceholder')}
                value={productCost}
                onChange={(e) => setProductCost(e.target.value)}
                inputProps={{
                  min: 0,
                  step: 1,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '8px',
                    fontSize: '14px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d0d0d0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: theme.palette.text.secondary,
                    opacity: 1,
                  },
                }}
              />
            </Box>
          )}

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={useForAds}
                  onChange={(e) => setUseForAds(e.target.checked)}
                  sx={{
                    color: '#e0e0e0',
                    '&.Mui-checked': {
                      color: theme.palette.text.primary,
                    },
                  }}
                />
              }
              label={t('useForAds')}
              sx={{
                '& .MuiFormControlLabel-label': {
                  fontSize: '1rem',
                  color: theme.palette.text.primary,
                },
              }}
            />
          </Box>
        </Box>

        {/* Additional requirements section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 2,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {t('additionalRequirements')}
            <span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>
              {' '}
              ({t('optional')})
            </span>
          </Typography>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder={t('additionalRequirementsPlaceholder')}
            value={additionalRequirements}
            onChange={(e) => setAdditionalRequirements(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: theme.palette.background.default,
                borderRadius: '8px',
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#e0e0e0',
                },
                '&:hover fieldset': {
                  borderColor: '#d0d0d0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Content delivery date section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.text.primary,
              mb: 1,
              fontWeight: 600,
              fontSize: '1.1rem',
            }}
          >
            {t('deliveryDate')}{' '}
            <span style={{ color: theme.palette.text.secondary, fontWeight: 400 }}>
              ({t('optional')})
            </span>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              mb: 2,
              fontSize: '0.875rem',
            }}
          >
            {t('deliveryDateInfo')}
          </Typography>

          <DatePicker
            value={deliveryDate}
            onChange={(newValue: Date | null) => setDeliveryDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: t('deliveryDatePlaceholder'),
                sx: {
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: theme.palette.background.default,
                    borderRadius: '8px',
                    fontSize: '14px',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                    },
                    '&:hover fieldset': {
                      borderColor: '#d0d0d0',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                    },
                  },
                },
              },
            }}
          />
        </Box>
        {/* Continue button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            sx={{
              backgroundColor: theme.palette.text.primary,
              color: theme.palette.background.paper,
              px: 4,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.palette.text.secondary,
              },
            }}
          >
            {t('continue')}{' '}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
