import { Box, Button, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/useCart';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export const EmptyCart = () => {
  const navigate = useNavigate();
  const { closeCart } = useCart();
  const { t } = useTranslation('cart');

  const styles = {
    button: {
      backgroundColor: '#1c1c1c',
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
  };

  const handleDiscover = () => {
    closeCart();
    navigate('/search');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      textAlign="center"
      gap={4}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Typography variant="h4" fontWeight="bold" mb={2}>
          {t('cart')}
        </Typography>

        <IconButton onClick={closeCart} sx={styles.iconButton}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        height="100%"
        textAlign="center"
        gap={4}
      >
        <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
          <Box
            component="img"
            src="/assets/cart.svg"
            alt="Empty Cart"
            width={100}
            height={150}
            mb={2}
          />
          <Typography variant="h6" fontWeight="bold" mb={1}>
            {t('emptyTitle')}
          </Typography>
          <Typography variant="body2" mb={4}>
            {t('emptyDesc')}
          </Typography>
        </Box>
        <Button onClick={handleDiscover} variant="contained" fullWidth sx={styles.button}>
          {t('discover')}
        </Button>
      </Box>
    </Box>
  );
};
