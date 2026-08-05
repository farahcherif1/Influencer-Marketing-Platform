import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Button,
  LinearProgress,
  useTheme,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import UploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRef } from 'react';
import type { mediumStepProps } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';
import { uploadMediaFiles } from '../../services/ImagesService';
import { MediaType } from '../../Types/MediaType';

interface ImageUploadStepProps extends mediumStepProps {
  initialImages: (string | null)[];
  onImagesChange: (images: (string | null)[]) => void;
}

export default function ImageUploadStep({
  onContinue,
  onBack,
  userId,
  initialImages,
  onImagesChange,
}: ImageUploadStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

  const profileImage = initialImages[0];
  const coverImages = initialImages.slice(1);

  const canContinue =
    profileImage !== null &&
    coverImages[0] !== null &&
    coverImages[1] !== null &&
    coverImages[2] !== null;

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        alert('Image too large. Maximum allowed size is 10 MB.');
        e.target.value = '';
        return;
      }
      const updated = [...initialImages];
      updated[0] = URL.createObjectURL(file);
      onImagesChange(updated);
    }
  };

  const handleCoverUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        alert('Cover image too large. Maximum allowed size is 10 MB.');
        e.target.value = '';
        return;
      }
      const updated = [...initialImages];
      updated[index + 1] = URL.createObjectURL(file);
      onImagesChange(updated);
    }
  };

  const handleContinue = async () => {
    try {
      // Profile Picture
      if (profileInputRef.current?.files?.length) {
        await uploadMediaFiles(userId, profileInputRef.current.files, MediaType.PROFILE_PICTURE);
      }

      // Cover Photos
      const coverFiles = new DataTransfer();
      coverInputRefs.current.forEach((ref) => {
        if (ref?.files?.[0]) coverFiles.items.add(ref.files[0]);
      });

      if (coverFiles.files.length > 0) {
        await uploadMediaFiles(userId, coverFiles.files, MediaType.COVER_PICTURE);
      }

      onContinue();
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        px: { xs: '24px', md: '80px' },
        py: { xs: '32px', md: '60px' },
        direction,
        mt: { xs: 10, sm: 7 },
      }}
    >
      <Box sx={{ mb: 6 }}>
        <LinearProgress
          variant="determinate"
          value={70}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: 1,
            '&:hover': { backgroundColor: theme.palette.action.hover },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600} textAlign="center">
          {t('imageUploadStep.title')}
        </Typography>
      </Box>

      {/* Profile Upload */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <IconButton
            onClick={() => profileInputRef.current?.click()}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: '#f1f1f1',
              border: '2px solid #ccc',
              mb: 1,
            }}
          >
            {profileImage ? (
              <Avatar src={profileImage} sx={{ width: 80, height: 80 }} />
            ) : (
              <PhotoCameraIcon sx={{ fontSize: 30, color: '#888' }} />
            )}
          </IconButton>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {t('imageUploadStep.profileImage')}
          </Typography>
          <input
            ref={profileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleProfileUpload}
          />
        </Box>
      </Box>

      {/* Cover Uploads */}
      <Box>
        {[...Array(10)].map((_, index) => {
          const isRequired = index < 3;
          const label = isRequired
            ? t('imageUploadStep.RequiredLabel')
            : t('imageUploadStep.optionalLabel');

          return (
            <Box key={index} sx={{ mb: 3 }}>
              <Box
                onClick={() => coverInputRefs.current[index]?.click()}
                sx={{
                  width: '100%',
                  height: 250,
                  backgroundColor: '#f1f1f1',
                  border: '2px dashed #ccc',
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {coverImages[index] ? (
                  <Box
                    component="img"
                    src={coverImages[index] as string}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                  />
                ) : (
                  <>
                    <UploadIcon sx={{ fontSize: 40, color: '#888' }} />
                    <Typography fontWeight={600} mt={1}>
                      {label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('imageUploadStep.clickToUpload')}
                    </Typography>
                  </>
                )}
                <input
                  ref={(el) => {
                    coverInputRefs.current[index] = el;
                  }}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleCoverUpload(index)}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      <Button
        onClick={handleContinue}
        fullWidth
        variant="contained"
        disabled={!canContinue}
        sx={{
          py: '16px',
          fontSize: '1.2rem',
          fontWeight: 600,
          borderRadius: '10px',
          backgroundColor: canContinue ? theme.palette.text.primary : '#ccc',
          color: canContinue ? 'white' : '#666',
          textTransform: 'none',
          boxShadow: 'none',
          mt: 2,
          cursor: canContinue ? 'pointer' : 'not-allowed',
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
