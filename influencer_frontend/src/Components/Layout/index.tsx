import { useEffect, useState } from 'react';
import { matchPath, Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import ReferralBanner from '../../Pages/ReferralPage/ReferralBanner';
import { Box } from '@mui/material';
import { useUser } from '../../Context/useUser';

const Layout = () => {
  const location = useLocation();
  const { user } = useUser();

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [signupCompleted, setSignupCompleted] = useState<boolean>(false);

  const noNavbarRoutes = ['/verify-email', '/checkout'];

  const noFooterRoutes = [
    '/login',
    '/signup',
    '/verify-email',
    '/complete-brand-profile',
    '/complete-creator-profile',
    '/referrals',
    '/creator/edit-profile',
    '/forgot-password',
    '/reset/:token/set-password/',
    '/orders',
    '/orders/:bookingId',
    'earnings',
  ];

  const hideNavbar = noNavbarRoutes.includes(location.pathname);
  const hideFooter = noFooterRoutes.some((path) =>
    matchPath({ path, end: true }, location.pathname),
  );

  const isProfileRoute = matchPath({ path: '/:username', end: true }, location.pathname);
  const isCompleteCreatorRoute = matchPath(
    { path: '/complete-creator-profile', end: true },
    location.pathname,
  );
  const isCompleteBrandRoute = matchPath(
    { path: '/complete-brand-profile', end: true },
    location.pathname,
  );

  const isOrderRoute = matchPath({ path: '/orders/:bookingId', end: true }, location.pathname);

  useEffect(() => {
    const isCompleted = localStorage.getItem('signupCompleted') === 'true';
    setSignupCompleted(isCompleted);

    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');

    if (ref) {
      localStorage.setItem('referralCode', ref);
      setReferralCode(ref);
    } else {
      const stored = localStorage.getItem('referralCode');
      if (stored) setReferralCode(stored);
    }
  }, [location, user]);

  const showBanner =
    referralCode && !signupCompleted && (!user || user.referralCode !== referralCode);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {!hideNavbar && <Navbar user={user} />}
      {showBanner && <ReferralBanner />}

      {isCompleteCreatorRoute || isCompleteBrandRoute ? (
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            padding: '0 10px',
            maxWidth: '1200px',
            margin: '0 auto',
            pt: showBanner ? '70px' : 0,
          }}
        >
          <Outlet />
        </Box>
      ) : isProfileRoute ? (
        <Box
          component="main"
          sx={{
            pt: showBanner ? '70px' : 0,
          }}
        >
          <Outlet />
        </Box>
      ) : isOrderRoute ? (
        <Box component="main">
          <Outlet />
        </Box>
      ) : (
        <Box
          component="main"
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 10px',
            maxWidth: 'calc(100% - 20px)',
            margin: '0 auto',
            pt: showBanner ? '70px' : 0,
          }}
        >
          <Outlet />
        </Box>
      )}

      {!hideFooter && <Footer />}
    </Box>
  );
};

export default Layout;
