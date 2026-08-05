import { Navigate, Outlet } from 'react-router-dom';
import { CartProvider } from './Context/cartProvider';
import { CartDrawer } from './Pages/CartPage/CartDrawer';
import { useUser } from './Context/useUser';
import Navbar from './Components/Navbar';
import { Box } from '@mui/system';

const BrandLayout = () => {
  const { user } = useUser();
  if (!user) return null;
  if (user.role !== 'brand') return <Navigate to="/" replace />;
  return (
    <CartProvider>
      <CartDrawer />
      <Box>
        <Navbar user={user} />
        <Box sx={{ padding: 15, paddingTop: 10, minHeight: '100vh' }}>
          <Outlet />
        </Box>
      </Box>
    </CartProvider>
  );
};

export default BrandLayout;
