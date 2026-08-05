import { Box, Typography, Divider, Button, Stack, Avatar } from '@mui/material';
import { useCart } from '../../Context/useCart';
import type { CartItem } from '../../Types/cart';
import { useEffect, useState } from 'react';
import theme from '../../theme';
import { createBooking } from '../../services/brandService';
import type { Media } from '../../Types/Creator';
import { getMediaByCreator } from '../../services/ImagesService';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface Step1Props {
  onBookingCreated: (id: number) => void;
}

export default function PlaceOrder({ onBookingCreated }: Step1Props) {
  const { cart } = useCart();
  const [paymentTab, setPaymentTab] = useState(0);
  const [, setMediaItems] = useState<Media[]>([]);
  const [mediaMap, setMediaMap] = useState<{ [creatorId: number]: string }>({});

  const { t, i18n } = useTranslation('placeOrder');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const subtotal =
    cart?.cartItems?.reduce(
      (sum: number, item: CartItem) => sum + (item.creatorService?.price ?? 0),
      0,
    ) ?? 0;

  const fee = subtotal * 0.1;
  const total = subtotal + fee;

  const handlePlaceOrder = async () => {
    try {
      const bookingId = await createBooking(cart!, total);
      onBookingCreated(bookingId);
    } catch (err) {
      console.error('Failed to create booking', err);
    }
  };
  useEffect(() => {
    cart?.cartItems?.forEach(async (item) => {
      const creatorId = item.creatorService.creator.id;
      const media = await getMediaByCreator(creatorId);
      setMediaItems(media);
      const profile = media.find((m) => m.type === 'PROFILE_PICTURE');
      const profilePhotoUrl = profile?.url ?? 'https://example.com/default-profile.jpg';
      setMediaMap((prev) => ({ ...prev, [creatorId]: profilePhotoUrl }));
    });
  }, [cart]);

  return (
    <Box sx={{ direction: direction }}>
      <Typography variant="h4" fontWeight="600" sx={{ color: theme.palette.text.primary, mb: 2 }}>
        {t('title')}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: theme.palette.text.primary, mb: 4, lineHeight: 1.5 }}
      >
        {t('description')}
      </Typography>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        <Box sx={{ flex: '1 1 50%' }}>
          {cart?.cartItems?.map((item, index) => (
            <Box key={item.id}>
              <Box display="flex" alignItems="center" justifyContent="space-between" py={3}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar
                    src={
                      mediaMap[item.creatorService.creator.id] ??
                      'https://example.com/default-profile.jpg'
                    }
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: 1,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      sx={{ color: theme.palette.text.primary, mb: 0.5 }}
                    >
                      {item.creatorService.quantity} {item.creatorService.service?.name}{' '}
                      {item.creatorService.duration &&
                        ` (${item.creatorService.duration} ${item.creatorService.durationUnit})`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {item.creatorService.creator?.name}
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  fontWeight="600"
                  sx={{ color: theme.palette.text.primary, fontSize: '18px' }}
                >
                  ${item.creatorService.price}
                </Typography>
              </Box>
              {index < (cart?.cartItems?.length ?? 0) - 1 && (
                <Divider sx={{ borderColor: '#f0f0f0' }} />
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ flex: '1 1 50%' }}>
          <Typography
            variant="h6"
            fontWeight="600"
            sx={{ color: theme.palette.text.primary, mb: 3 }}
          >
            {t('orderSummary')}
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Stack spacing={2} mb={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: theme.palette.text.primary }}>{t('subtotal')}</Typography>
              <Typography sx={{ color: theme.palette.text.primary }}>
                ${subtotal.toFixed(2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ color: theme.palette.text.primary }}>
                {t('fee')}{' '}
                <span style={{ color: theme.palette.text.secondary, fontSize: '14px' }}>ⓘ</span>
              </Typography>
              <Typography sx={{ color: theme.palette.text.primary }}>${fee.toFixed(2)}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="space-between" mb={4}>
            <Typography fontWeight="600" sx={{ color: theme.palette.text.primary }}>
              {t('total')}
            </Typography>
            <Typography fontWeight="600" sx={{ color: theme.palette.text.primary }}>
              ${total.toFixed(2)} USD
            </Typography>
          </Stack>

          {/* Payment Options */}
          <Stack direction="row" spacing={0} mb={3}>
            <Button
              variant={paymentTab === 0 ? 'contained' : 'text'}
              onClick={() => setPaymentTab(0)}
              sx={{
                textTransform: 'none',
                fontWeight: paymentTab === 0 ? 600 : 400,
                color: paymentTab === 0 ? theme.palette.text.primary : theme.palette.text.secondary,
                backgroundColor: paymentTab === 0 ? 'transparent' : 'transparent',
                borderBottom: paymentTab === 0 ? `2px solid ${theme.palette.text.primary}` : 'none',
                borderRadius: 0,
                px: 0,
                mr: 3,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {t('useBalance')}
            </Button>
            <Button
              variant={paymentTab === 1 ? 'contained' : 'text'}
              onClick={() => setPaymentTab(1)}
              sx={{
                textTransform: 'none',
                fontWeight: paymentTab === 1 ? 600 : 400,
                color: paymentTab === 1 ? theme.palette.text.primary : theme.palette.text.secondary,
                backgroundColor: paymentTab === 1 ? 'transparent' : 'transparent',
                borderBottom: paymentTab === 1 ? `2px solid ${theme.palette.text.primary}` : 'none',
                borderRadius: 0,
                px: 0,
                mr: 3,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {t('useCard')}
            </Button>
            <Button
              variant={paymentTab === 2 ? 'contained' : 'text'}
              onClick={() => setPaymentTab(2)}
              sx={{
                textTransform: 'none',
                fontWeight: paymentTab === 2 ? 600 : 400,
                color: paymentTab === 2 ? theme.palette.text.primary : theme.palette.text.secondary,
                backgroundColor: paymentTab === 2 ? 'transparent' : 'transparent',
                borderBottom: paymentTab === 2 ? `2px solid ${theme.palette.text.primary}` : 'none',
                borderRadius: 0,
                px: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              {t('addCard')}
            </Button>
          </Stack>

          {paymentTab === 0 && (
            <Typography
              variant="h6"
              fontWeight={600}
              mb={4}
              sx={{ color: theme.palette.text.primary }}
            >
              {t('balance')}: ${total.toFixed(2)}
            </Typography>
          )}
          {paymentTab === 1 && (
            <Typography
              variant="h6"
              fontWeight={600}
              mb={4}
              sx={{ color: theme.palette.text.primary }}
            >
              {t('savedCard')}
            </Typography>
          )}
          {paymentTab === 2 && (
            <Typography
              variant="h6"
              fontWeight={600}
              mb={4}
              sx={{ color: theme.palette.text.primary }}
            >
              {t('addPayment')}
            </Typography>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{
              backgroundColor: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.text.secondary,
              },
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              py: 2,
              borderRadius: 2,
              boxShadow: 'none',
            }}
            onClick={handlePlaceOrder}
          >
            {t('placeOrder')}
          </Button>
        </Box>
      </Stack>
      {/* Process Steps Section */}
      <Box mt={15}>
        <Stack direction="row" spacing={4} alignItems="flex-start">
          {/* Step 1 */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `1px solid ${theme.palette.text.primary}`,
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '18px',
                mx: 'auto',
                mb: 2,
              }}
            >
              1
            </Box>
            <Typography
              variant="h6"
              fontWeight="400"
              sx={{ color: theme.palette.text.primary, mb: 1 }}
            >
              {t('steps.1.title')}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {t('steps.1.description')}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `1px solid ${theme.palette.text.primary}`,
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '18px',
                mx: 'auto',
                mb: 2,
              }}
            >
              2
            </Box>
            <Typography
              variant="h6"
              fontWeight="400"
              sx={{ color: theme.palette.text.primary, mb: 1 }}
            >
              {t('steps.2.title')}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {' '}
              {t('steps.2.description')}
            </Typography>
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: `1px solid ${theme.palette.text.primary}`,
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '18px',
                mx: 'auto',
                mb: 2,
              }}
            >
              3
            </Box>
            <Typography
              variant="h6"
              fontWeight="400"
              sx={{ color: theme.palette.text.primary, mb: 1 }}
            >
              {t('steps.3.title')}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {t('steps.3.description')}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
