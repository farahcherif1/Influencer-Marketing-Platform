import { Box, Button, Typography, CardMedia } from '@mui/material';
import imageInfluencer from '../../assets/influencer.png';
import theme from '../../theme';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { isRtl } from '../../i18n/isRtl';

export default function FindInfluencerCard() {
  const { t } = useTranslation('homePage');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const boxPosition = isRtl(currentLang) ? { right: 150, bottom: 70 } : { left: 150, bottom: 70 };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        mt: 10,
        position: 'relative', // so absolute child works
        direction,
      }}
    >
      {imageInfluencer && (
        <CardMedia
          component="img"
          image={imageInfluencer}
          alt="influencer"
          sx={{
            objectFit: 'cover',
            borderRadius: '16px',
            width: 1300,
            height: 350,
            filter: 'brightness(30%)',
            mx: 4,
          }}
        />
      )}
      <Box position="absolute" sx={boxPosition}>
        <Typography variant="h2" sx={{ color: 'white' }} gutterBottom>
          {t('find_influencer')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'white' }} paragraph>
          {t('search_description')}
        </Typography>
        <Button
          variant="contained"
          sx={{ bgcolor: 'white', color: theme.palette.text.primary, mt: 2 }}
        >
          {t('search_button')}
        </Button>
      </Box>
    </Box>
  );
}
