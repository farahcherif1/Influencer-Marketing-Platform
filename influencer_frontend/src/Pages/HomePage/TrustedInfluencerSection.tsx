import { Box, Typography } from '@mui/material';
import VideoCard from './VideoCard';
import ImageCard from './ImageCard';
import influencer from '../../assets/creator.jpeg';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';

export default function TrustedInfluencerSection() {
  const { t } = useTranslation('homePage');
  return (
    <Box>
      <Typography variant="h4" fontWeight={600}>
        {t('trustedBy')}
      </Typography>
      <Typography sx={{ my: 1, color: theme.palette.text.secondary }}>
        {t('collaborations')}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 1,
          my: 3,
          paddingBottom: 1,
          scrollSnapType: 'x mandatory', // Enable scroll snapping
          WebkitOverflowScrolling: 'touch',
          maxWidth: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          whiteSpace: 'nowrap',
          justifyContent: 'flex-start',
        }}
      >
        <Box sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
          <VideoCard src="https://d5ik1gor6xydq.cloudfront.net/websiteImages/content/3.mp4#t=0.1" />
        </Box>
        <Box sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
          <ImageCard imageSrc={influencer} link="/your-link" />
        </Box>
        <Box sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
          <VideoCard src="https://d5ik1gor6xydq.cloudfront.net/websiteImages/content/3.mp4#t=0.1" />
        </Box>
        <Box sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
          <ImageCard imageSrc={influencer} link="/another-link" />
        </Box>
        <Box sx={{ flex: '0 0 auto', scrollSnapAlign: 'start' }}>
          <VideoCard src="https://d5ik1gor6xydq.cloudfront.net/websiteImages/content/3.mp4#t=0.1" />
        </Box>
      </Box>
    </Box>
  );
}
