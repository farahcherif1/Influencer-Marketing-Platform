import { Box, Typography, IconButton, Stack, Divider, Button, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCart } from '../../Context/useCart';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CartItem } from '../../Types/cart';
import { useNavigate } from 'react-router-dom';
import type { Media } from '../../Types/Creator';
import { getMediaByCreator } from '../../services/ImagesService';

export const CartItemsList = () => {
  const { cart, removeItem, closeCart } = useCart();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { t } = useTranslation('cart');
  const navigate = useNavigate();
  const [, setMediaItems] = useState<Media[]>([]);
  const [mediaMap, setMediaMap] = useState<{ [creatorId: number]: string }>({});

  const subtotal =
    cart?.cartItems?.reduce(
      (sum: number, item: CartItem) => sum + (item.creatorService?.price ?? 0),
      0,
    ) ?? 0;

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

  const styles = {
    button: {
      backgroundColor: '#000',
      color: 'white',
      px: 4,
      '&:hover': { backgroundColor: '#000' },
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '1.2rem',
      borderRadius: 1,
    },
    iconButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'black',
      boxShadow: 2,
      width: '20px',
      height: '20px',
    },
    avatar: {
      width: 55,
      height: 55,
      borderRadius: '10%',
    },
    removeText: {
      color: 'gray',
      cursor: 'pointer',
      mt: 4,
      display: 'inline-block',
      fontSize: '0.6rem',
      textDecoration: 'underline',
    },
  };

  const handleRemoveClick = (id: string) => {
    if (confirmingId === id) {
      removeItem(id);
      setConfirmingId(null);
    } else {
      setConfirmingId(id);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Box
      p={3}
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      //justifyContent="space-between"
      sx={{
        position: 'relative',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            {t('cart')}
          </Typography>
          <IconButton onClick={closeCart} sx={styles.iconButton}>
            <CloseIcon />
          </IconButton>
        </Box>

        {cart?.cartItems?.map((item: CartItem, index: number) => (
          <Box key={item.id}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <Avatar
                src={
                  mediaMap[item.creatorService.creator.id] ??
                  'https://example.com/default-profile.jpg'
                }
                sx={styles.avatar}
              />
              <Box flexGrow={1}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {item.creatorService.quantity} {item.creatorService.service?.name}{' '}
                      {item.creatorService.duration &&
                        ` (${item.creatorService.duration} ${item.creatorService.durationUnit})`}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {item.creatorService.creator?.name}
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2" fontWeight="bold">
                      ${item.creatorService?.price}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={styles.removeText}
                      onClick={() => handleRemoveClick(item.id)}
                    >
                      {confirmingId === item.id ? t('confirm') : t('remove')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Stack>
            {index < cart.cartItems.length && <Divider sx={{ mb: 2 }} />}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          backgroundColor: 'white',
          py: 2,
          borderTop: '1px solid #ddd',
          zIndex: 2,
        }}
      >
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" justifyContent="space-between" mb={1}>
          <Typography variant="body2" fontWeight="bold">
            {t('subtotal')}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            ${subtotal.toFixed(2)}
          </Typography>
        </Stack>

        <Button variant="contained" fullWidth sx={styles.button} onClick={handleCheckout}>
          {t('checkout')}
        </Button>
      </Box>
    </Box>
  );
};
