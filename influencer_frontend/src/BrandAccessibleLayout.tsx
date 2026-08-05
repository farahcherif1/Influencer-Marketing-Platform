import { Outlet } from 'react-router-dom';
import { CartProvider } from './Context/cartProvider';
import { useUser } from './Context/useUser';
import { CartDrawer } from './Pages/CartPage/CartDrawer';

const BrandAccessibleLayout = () => {
  const { user } = useUser();
  const isBrand = user?.role === 'brand';

  return (
    <CartProvider>
      {isBrand && <CartDrawer />}
      <Outlet />
    </CartProvider>
  );
};
export default BrandAccessibleLayout;
