import { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, CircularProgress, Snackbar, styled } from '@mui/material';
import { CloudUploadIcon } from 'lucide-react';
import { useUser } from '../../../Context/useUser';
import {
  uploadBrandProfilePicture,
  uploadBrandCoverPicture,
  getBrandByUsername,
} from '../../../services/brandService';
import { useTranslation } from 'react-i18next';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function BrandImagesTab() {
  const { user } = useUser();
  const brandId = user?.id;

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverPicture, setCoverPicture] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('common');

  useEffect(() => {
    if (!user?.username) return;

    (async () => {
      try {
        const brand = await getBrandByUsername(user.username!);
        setProfilePicture(brand.logoUrl || null);
        setCoverPicture(brand.coverPhotoUrl || null);
      } catch (err) {
        console.error('Failed to fetch brand:', err);
      }
    })();
  }, [user?.username]);

  const validateImage = (file: File) => {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (img.width >= 700 && img.height >= 700) resolve(true);
        else resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleProfileUpload = async (file: File) => {
    if (!brandId) return;

    const isValid = await validateImage(file);
    if (!isValid) {
      setAlertMessage('Profile image must be at least 700x700');
      return;
    }

    try {
      const updatedBrand = await uploadBrandProfilePicture(brandId, file);
      setProfilePicture(updatedBrand.logoUrl);
    } catch (err) {
      console.error('Profile upload failed:', err);
    }
  };

  const handleCoverUpload = async (file: File) => {
    if (!brandId) return;

    const isValid = await validateImage(file);
    if (!isValid) {
      setAlertMessage('Cover image must be at least 700x700');
      return;
    }

    try {
      const updatedBrand = await uploadBrandCoverPicture(brandId, file);
      setCoverPicture(updatedBrand.coverPhotoUrl);
    } catch (err) {
      console.error('Cover upload failed:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate save API call
    setTimeout(() => {
      setToastOpen(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <Box>
      {/* Profile Picture */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button component="label">
          <Avatar src={profilePicture || undefined} sx={{ width: 80, height: 80 }} />
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleProfileUpload(e.target.files[0])}
          />
        </Button>
      </Box>

      {/* Cover Picture */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          component="label"
          sx={{
            width: '100%',
            maxWidth: 1000,
            height: 400,
            p: 0,
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          {coverPicture ? (
            <img
              src={coverPicture}
              alt="Cover"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                border: '2px dashed #ccc',
                color: '#999',
                fontSize: 18,
              }}
            >
              <CloudUploadIcon size={48} />
              Upload Cover
            </Box>
          )}
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleCoverUpload(e.target.files[0])}
          />
        </Button>
      </Box>

      {alertMessage && (
        <Box mb={2}>
          <Alert severity="error" onClose={() => setAlertMessage(null)}>
            {alertMessage}
          </Alert>
        </Box>
      )}

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{ backgroundColor: 'black', color: 'white' }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('save')}
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
          {t('saved_successfully')}
        </Alert>
      </Snackbar>
    </Box>
  );
}
