import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Stack,
  Snackbar,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

interface ShareDialogProps {
  open: boolean;
  onClose: () => void;
  profileUrl: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ open, onClose, profileUrl }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation('profile');

  const handleCopy = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
  };

  const handleCloseSnackbar = () => {
    setCopied(false);
  };
  const styles = {
    button: {
      backgroundColor: 'black',
      color: 'white',
      px: 4,
      '&:hover': { backgroundColor: '#000' },
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '1.20 rem',
    },
    title: {
      position: 'relative',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '1.25rem',
      p: 2,
    },
    iconButton: {
      position: 'absolute',
      right: 8,
      top: 8,
      color: 'black',
      boxShadow: 3,
      width: '30px',
      height: '30px',
    },
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={styles.title}>
          {t('profile.shareDialog.title')}
          <IconButton onClick={onClose} sx={styles.iconButton}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ my: 4 }}>
          <Stack spacing={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                fullWidth
                value={profileUrl}
                InputProps={{
                  readOnly: true,
                  sx: {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    backgroundColor: '#fff',
                    px: 1,
                    height: '50px',
                  },
                }}
                variant="outlined"
                size="small"
              />
              <Button onClick={handleCopy} variant="contained" sx={styles.button}>
                {t('profile.shareDialog.copyLink')}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={t('profile.shareDialog.linkCopied')}
      />
    </>
  );
};
