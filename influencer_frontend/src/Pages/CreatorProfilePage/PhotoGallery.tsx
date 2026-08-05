import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Grid2X2Check, Grid3X3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Media } from '../../Types/Creator';

const PhotoGallery: React.FC<{ medias: Media[] }> = ({ medias }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { t } = useTranslation('profile');

  const styles = {
    button: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      height: 40,
      gap: 1,
      bgcolor: 'white',
      color: 'text.primary',
      backdropFilter: 'blur(4px)',
      opacity: 0.9,
      '&:hover': {
        bgcolor: 'background.paper',
      },
    },
    Mobileimg: {
      width: '100%',
      height: 450,
      objectFit: 'cover',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    deskImg: {
      width: '100%',
      height: 450,
      objectFit: 'cover',
      borderRadius: 0.5,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
    },
    dialogTitle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    dialogBox: {
      width: '100%',
      height: 256,
      objectFit: 'cover',
      borderRadius: 2,
    },
  };

  if (!medias || medias.length === 0) return null;

  // Trouve la photo cover ou prend la première
  const coverMedia = medias.find((m) => m.type === 'COVER_PICTURE');
  const coverPhotoUrl = coverMedia ? coverMedia.url : medias[0].url;

  return (
    <Box position="relative">
      {isMobile ? (
        <Box position="relative">
          <Box component="img" src={coverPhotoUrl} alt="Cover content" sx={styles.Mobileimg} />
          <Button
            onClick={() => setOpen(true)}
            sx={styles.button}
            startIcon={<Grid3X3 size={16} />}
          >
            {t('profile.showPhotos')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {/* Affiche uniquement 3 photos sur desktop */}
          {medias.slice(0, 3).map((media, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Box
                component="img"
                src={media.url}
                alt={`Media content ${index + 1}`}
                sx={styles.deskImg}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {!isMobile && (
        <Button
          onClick={() => setOpen(true)}
          variant="outlined"
          sx={styles.button}
          startIcon={<Grid2X2Check size={16} />}
        >
          {t('profile.showPhotos')}
        </Button>
      )}

      {/* Dialog pour mobile */}
      <Dialog
        fullScreen
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { md: 'none' } }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          <Typography variant="h6"> {t('profile.allPhotos')}</Typography>
          <IconButton edge="end" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {medias.map((media, index) => (
              <Grid sx={{ xs: 12 }} key={index}>
                <Box
                  component="img"
                  src={media.url}
                  alt={`Fitness content ${index + 1}`}
                  sx={styles.dialogBox}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Dialog pour desktop */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { xs: 'none', md: 'block' } }}
      >
        <DialogTitle sx={styles.dialogTitle}>
          <Typography variant="h6"> {t('profile.allPhotos')}</Typography>
          <IconButton edge="end" onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {medias.map((media, index) => (
              <Grid sx={{ xs: 12, md: 4 }} key={index}>
                <Box
                  component="img"
                  src={media.url}
                  alt={`Fitness content ${index + 1}`}
                  sx={styles.dialogBox}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PhotoGallery;
