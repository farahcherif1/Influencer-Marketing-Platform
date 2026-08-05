import { Share } from 'lucide-react';
import { Typography, Button, Stack, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { ShareDialog } from './shareDialog';

type ProfileHeaderProps = {
  title: string;
  profileUrl: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, profileUrl }) => {
  const styles = {
    paper: {
      px: 3,
      py: 2,
      bgcolor: 'background.paper',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '90px',
      borderRadius: 0.5,
    },
    button: {
      color: 'text.secondary',
      borderColor: 'transparent',
      '&:hover': {
        borderColor: 'primary.main',
        color: 'primary.main',
      },
      width: '100px',
      height: '36px',
      gap: 1,
    },
  };
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('profile');
  return (
    <Paper elevation={0} sx={styles.paper}>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        {title}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          size="small"
          startIcon={<Share size={16} />}
          sx={styles.button}
        >
          {t('profile.share')}
        </Button>
        <ShareDialog open={open} onClose={() => setOpen(false)} profileUrl={profileUrl} />
      </Stack>
    </Paper>
  );
};
export default ProfileHeader;
