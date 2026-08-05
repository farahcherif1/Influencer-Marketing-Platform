import { Drawer, Grid, useMediaQuery, useTheme } from '@mui/material';
//import { EstimationModal } from './EstimationModal';
import { CartItemsList } from './CartItemsList';
import { useCart } from '../../Context/useCart';
import { EmptyCart } from './emptyCart';

export const CartDrawer = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { cart, isCartOpen, closeCart } = useCart();
  const isCartEmpty = cart?.cartItems?.length === 0;

  return (
    <Drawer
      anchor="right"
      open={isCartOpen}
      onClose={closeCart}
      PaperProps={{
        sx: { maxWidth: 950, borderRadius: '0%' },
      }}
    >
      <Grid container height="100%">
        <Grid size={{ xs: isSmallScreen ? 12 : 12 }} sx={{ p: 1 }}>
          {isCartEmpty ? <EmptyCart /> : <CartItemsList />}
        </Grid>
      </Grid>
    </Drawer>
  );
};
