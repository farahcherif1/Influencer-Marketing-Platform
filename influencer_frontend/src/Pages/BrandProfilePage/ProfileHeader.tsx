import {
  Avatar,
  Box,
  Button,
  IconButton,
  SvgIcon,
  Typography,
  type SvgIconProps,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InstagramIcon from '@mui/icons-material/Instagram';
import theme from '../../theme';
import { Link, useNavigate } from 'react-router-dom';
import type { Brand } from '../../entities/Brand';
import LinkIcon from '@mui/icons-material/Link';
import CompletionBanner from './CompletionBanner';
const TikTokIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} viewBox="0 0 448 512">
    <path
      fill="currentColor"
      d="M448 209.91a210.06 210.06 0 0 1-122.77-39.25V349.38A162.55 162.55 0 1 1 185 188.31V278.2a74.62 74.62 0 1 0 52.23 71.18V0l88 0a121.18 121.18 0 0 0 1.86 22.17h0A122.18 122.18 0 0 0 381 102.39a121.43 121.43 0 0 0 67 20.14z"
    />
  </SvgIcon>
);

export default function ProfileHeader({ brand }: { brand: Brand }) {
  const isProfileIncomplete = !brand.logoUrl && !brand.description && !brand.coverPhotoUrl;
  const backgroundStyle = brand.coverPhotoUrl
    ? {
        backgroundImage: `url(${brand.coverPhotoUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9e9e9e',
      };

  const styles = {
    container: {
      position: 'relative',
      mt: { xs: 4, md: 7 },
    },
    editButton: {
      position: 'absolute',
      right: -22,
      top: -60,
      color: theme.palette.text.primary,
      fontWeight: 'normal',
      textTransform: 'none',
      '&:hover': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
    avatar: {
      position: 'absolute',
      zIndex: 2,
      top: 5,
      left: 5,
      bgcolor: '#bdbdbd',
      color: theme.palette.text.primary,
      fontWeight: 'bold',
      width: 80,
      height: 80,
      mx: 'auto',
      fontSize: '2.5rem',
    },
    brandName: {
      color: theme.palette.text.primary,
      textAlign: 'center',
      mt: { xs: 3, sm: 4, md: 6 },
      mr: 2,
    },
    description: {
      mt: 7,
      color: theme.palette.text.primary,
      px: { xs: 2, sm: 5, md: 18 },
    },
    link: {
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
    boxIcons: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: theme.palette.text.primary,
      fontSize: '70',
    },
    tiktokIcon: {
      color: theme.palette.text.primary,
      px: 0.5,
    },
    countrytitle: { color: theme.palette.text.secondary, textAlign: 'center', mt: 1 },
    boxEdit: { position: 'absolute', right: 14, top: 20, width: 80, height: 40 },
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'web site':
        return <LinkIcon sx={styles.icon} />;
      case 'instagram':
        return <InstagramIcon sx={styles.icon} />;
      case 'tiktok':
        return <TikTokIcon sx={styles.icon} />;
    }
  };
  const navigate = useNavigate();

  return (
    <>
      <Box sx={styles.container}>
        {isProfileIncomplete && (
          <Box sx={{ mb: 5 }}>
            <CompletionBanner />
          </Box>
        )}
        <Box
          sx={{
            height: { xs: 300, sm: 300, md: 400 },
            borderRadius: { xs: 0, sm: 2, md: 0 },
            mx: { sx: 0, md: 18 },
            position: 'relative',
            ...backgroundStyle,
          }}
        >
          <Box sx={styles.boxEdit}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              sx={styles.editButton}
              onClick={() => navigate('/brand/edit-profile')}
            >
              Edit
            </Button>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: { xs: 0, sm: -40, md: -50 },

              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 100,
                height: 100,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 90,
                  height: 90,
                  bgcolor: 'white',
                  borderRadius: '50%',
                  zIndex: 1,
                }}
              ></Box>

              <Avatar src={brand.logoUrl ?? undefined} sx={styles.avatar}>
                {!brand.logoUrl && brand.brandName?.charAt(0).toLocaleUpperCase()}
              </Avatar>
            </Box>
          </Box>
        </Box>
      </Box>

      <Typography variant="h5" sx={styles.brandName} fontWeight="bold">
        {brand.brandName}
      </Typography>
      <Typography variant="subtitle1" sx={styles.countrytitle}>
        {brand.location}
      </Typography>

      <Box sx={styles.boxIcons}>
        {brand.socialChannels
          ?.sort((a, b) => {
            const order: Record<string, number> = { 'web site': 0, instagram: 1, tiktok: 2 };
            return order[a.platform.toLowerCase()] - order[b.platform.toLowerCase()];
          })
          .map((channel, index) => (
            <IconButton
              key={index}
              onClick={() => window.open(channel.url, '_blank')}
              sx={{ mt: 1 }}
            >
              {getSocialIcon(channel.platform)}
            </IconButton>
          ))}
      </Box>

      {brand.description ? (
        <Typography variant="body1" sx={styles.description} maxWidth={1400}>
          {brand.description}
        </Typography>
      ) : (
        <Typography variant="body1" sx={styles.description} maxWidth={1400}>
          A quality description, logo and adding your social channels results in 3x more influencer
          collaborations on Collabios.
          <Link to="/brand/edit-profile" style={styles.link}>
            {' '}
            Complete your profile now.{' '}
          </Link>
        </Typography>
      )}
    </>
  );
}
