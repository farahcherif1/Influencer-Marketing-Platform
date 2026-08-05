import { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { isRtl } from '../../i18n/isRtl';
import LanguageSwitcher from '../LanguageSwitcher';
import type { User } from '../../Types/Creator';
import { handleLogout } from '../../services/authService';
import { useUser } from '../../Context/useUser';
import { useCart } from '../../Context/useCart';
import { getBrandByUsername } from '../../services/brandService';
import { getMediaByCreator } from '../../services/ImagesService';

export default function Navbar({ user }: { user: User | null }) {
  const { t, i18n } = useTranslation('navbar');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cart, openCart } = useCart();

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.username) {
      setAvatarUrl(null);
      return;
    }

    (async () => {
      try {
        if (user.role === 'brand') {
          const brand = await getBrandByUsername(user.username!);
          setAvatarUrl(brand.logoUrl ?? null);
        } else if (user.role === 'creator') {
          const media = await getMediaByCreator(user.id);
          const profile = media.find((m) => m.type === 'PROFILE_PICTURE');
          setAvatarUrl(profile?.url ?? null);
        }
      } catch (err) {
        console.error('Failed to fetch avatar:', err);
        setAvatarUrl(null);
      }
    })();
  }, [user?.username, user?.id, user?.role]);

  const styles = {
    appBar: {
      backgroundColor: 'white',
      elevation: 0,
      boxShadow: 'none',
    },
    toolbar: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      direction: direction,
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '85px',
      px: { xs: 2, sm: 3, md: 6 },
    },
    // For logged out users - keep links on the right
    navLinks: {
      display: 'flex',
      gap: '2px',
      alignItems: 'center',
      justifyContent: 'flex-end',
      flexGrow: 1,
    },
    // For logged in users - center the navigation links
    centeredNavLinks: {
      display: 'flex',
      gap: '2px',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
    },
    brandBox: {
      flexGrow: 0,
      textAlign: direction === 'rtl' ? 'left' : 'left',
      cursor: 'pointer',
    },
    menuIconButton: {
      color: '#000000',
      display: { xs: 'block', md: 'none' },
      '&:focus': {
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
      },
    },
    menuBtn: {
      fontWeight: 500,
      color: theme.palette.text.primary,
      height: '40px',
      minWidth: 0, // allows button to shrink to fit text
      padding: '6px 20px', // controls horizontal spacin
      fontSize: '15px',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#000000',
        boxShadow: 'none',
      },
    },
    joinBtn: {
      fontWeight: 500,
      WebkitTextFillColor: 'transparent',
      backgroundImage: `linear-gradient(to right, ${theme.palette.secondary.light}, ${theme.palette.secondary.dark},${theme.palette.primary.dark})`,
      WebkitBackgroundClip: 'text',
      minWidth: 0, // allows button to shrink to fit text
      padding: '3px 11px', // horizontal padding
      fontSize: '15px',

      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
    listItemText: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    },
    drawerList: {
      direction: direction,
    },
  };

  const loggedOutLinks = [
    { label: t('search'), href: '/search' },
    { label: t('howItWorks'), href: '#' },
    { label: t('login'), href: '/login', join: false },
    { label: t('joinBrand'), href: '/signup?role=brand', join: false },
    { label: t('joinCreator'), href: '/signup?role=creator', join: true },
  ];

  const brandLinks = [
    { label: t('home'), href: '/', join: false },
    { label: t('search'), href: '/search', join: false },
    { label: t('orders'), href: '/orders', join: false },
  ];

  const creatorLinks = [
    { label: t('home'), href: '/', join: false },
    { label: t('search'), href: '/search', join: false },
    { label: t('orders'), href: '/orders', join: false },
  ];

  const linksToRender =
    user && !user.profileComplete
      ? []
      : user
        ? user.role === 'brand'
          ? brandLinks
          : creatorLinks
        : loggedOutLinks;

  const brandAvatarMenuItems = [
    {
      label: t('profile'),
      href: user?.profileComplete ? `/${user?.username}` : '/complete-brand-profile',
      fontWeight: 600,
    },
    { label: t('lists'), href: '/lists', fontWeight: 600 },
    { label: t('referrals'), href: '/referrals', fontWeight: 600 },
    { label: t('billing'), href: '/billing', fontWeight: 400 },
    { label: t('editProfile'), href: '/brand/edit-profile', fontWeight: 400 },
    { label: t('signOut'), href: '/logout', fontWeight: 400 },
  ];
  const creatorAvatarMenuItems = [
    {
      label: t('profile'),
      href: user?.profileComplete ? `/${user?.username}` : '/complete-creator-profile',
      fontWeight: 600,
    },
    { label: t('earnings'), href: '/earnings', fontWeight: 600 },
    { label: t('referrals'), href: '/referrals', fontWeight: 600 },
    { label: t('editProfile'), href: '/creator/edit-profile', fontWeight: 400 },
    { label: t('signOut'), href: '/logout', fontWeight: 400 },
  ];
  const avatarMenuItems = user
    ? user.role === 'brand'
      ? brandAvatarMenuItems
      : creatorAvatarMenuItems
    : [];
  const isLoggedIn = user && user.profileComplete;

  return (
    <AppBar sx={styles.appBar}>
      <Toolbar sx={styles.toolbar}>
        {/* Brand */}
        <Box sx={styles.brandBox} onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Collabios Logo" style={{ width: 140 }} />
        </Box>

        {/* Desktop menu */}
        {!isMobile && (
          <Box sx={isLoggedIn ? styles.centeredNavLinks : styles.navLinks}>
            {linksToRender.map((link, idx) => (
              <Button
                key={idx}
                component="a"
                href={link.href}
                sx={link.join ? styles.joinBtn : styles.menuBtn}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {/* Right-side actions (Desktop) */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {<LanguageSwitcher />}

            {user && (
              <>
                {user.profileComplete && user.role === 'brand' && (
                  <IconButton sx={{ color: theme.palette.text.primary }} onClick={openCart}>
                    <Badge
                      badgeContent={cart?.cartItems?.length ?? 0}
                      color="secondary"
                      overlap="circular"
                    >
                      <ShoppingCartIcon
                        sx={{
                          fill: 'white',
                          stroke: 'black',
                          strokeWidth: 1,
                        }}
                      />
                    </Badge>
                  </IconButton>
                )}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '50px',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    bgcolor: theme.palette.background.paper,
                  }}
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                  <IconButton
                    size="small"
                    sx={{ color: theme.palette.text.primary, padding: 0, mr: 1 }}
                  >
                    <MenuIcon fontSize="small" />
                  </IconButton>
                  <Avatar
                    src={avatarUrl || undefined}
                    alt={user.name || 'User'}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: avatarUrl ? 'transparent' : theme.palette.secondary.main,
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 600,
                    }}
                  >
                    {!avatarUrl && user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Mobile menu icon */}
        {isMobile && (
          <IconButton
            edge="end"
            sx={styles.menuIconButton}
            aria-label="menu"
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Avatar Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={{
          '& .MuiPaper-root': {
            minWidth: '150px',
            mt: 1,
          },
        }}
      >
        {avatarMenuItems.map((item, idx) => (
          <div key={idx}>
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                if (item.href === '/logout') {
                  handleLogout(setUser, navigate);
                } else {
                  navigate(item.href);
                }
              }}
              sx={{
                fontSize: '14px',
                fontWeight: item.fontWeight,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              {item.label}
            </MenuItem>
            {/* Add divider after the first 3 items (index 2) */}
            {idx === 2 && (
              <Box
                sx={{
                  height: '1px',
                  backgroundColor: theme.palette.divider,
                  mx: 1,
                  my: 0.5,
                }}
              />
            )}
          </div>
        ))}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer anchor="top" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List sx={styles.drawerList}>
          {linksToRender.map((link, idx) => (
            <ListItem
              key={idx}
              sx={styles.listItemText}
              onClick={() => {
                setOpen(false);
                navigate(link.href);
              }}
            >
              <ListItemText primary={link.label} />
            </ListItem>
          ))}
          {user &&
            avatarMenuItems.map((item, idx) => (
              <ListItem
                key={idx}
                sx={styles.listItemText}
                onClick={() => {
                  setOpen(false);
                  if (item.href === '/logout') {
                    handleLogout(setUser, navigate);
                  } else {
                    navigate(item.href);
                  }
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
