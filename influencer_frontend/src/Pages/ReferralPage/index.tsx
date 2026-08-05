import {
  Box,
  Button,
  Typography,
  useTheme,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Divider,
  Paper,
  Fade,
  Grid,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useState } from 'react';
import { Modal, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useUser } from '../../Context/useUser';
import { sendEmailInvite } from '../../services/brandService';
import { useTranslation } from 'react-i18next';

export default function ReferralsPage() {
  const theme = useTheme();
  const { t } = useTranslation('referral');

  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useUser();
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const handleInvite = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(inviteEmail)) {
      setEmailError(true);
      setInviteSuccess(false);
      return;
    }
    try {
      setEmailError(false);
      setInviteSuccess(false);
      await sendEmailInvite(inviteEmail, user?.id || 0);
      setInviteSuccess(true);
      setInviteEmail('');
      setTimeout(() => {
        setInviteSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setInviteSuccess(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        minHeight: '100vh',
      }}
    >
      <Paper
        sx={{
          p: 4,
          mx: 'auto',
          mt: 8,
          elevation: 0,
        }}
      >
        {/* Header Section */}
        <Fade in timeout={800}>
          <Box
            sx={{
              width: '100%',
              background: `linear-gradient(90deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
              color: 'white',
              px: 4,
              py: 5,
              borderRadius: '12px',
              mb: 6,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h4" fontWeight={600}>
                  {t('header.title')}
                </Typography>
                <Typography sx={{ mt: 1, color: 'white' }}>{t('header.description')}</Typography>
              </Box>

              <Button
                onClick={() => setModalOpen(true)}
                variant="contained"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  fontWeight: 600,
                  borderRadius: '10px',
                  px: 2,
                  height: 50,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              >
                {t('header.button')}
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Metrics Section */}
        <Fade in timeout={1000}>
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={8}
                sx={{
                  px: 6,
                  py: 4,
                  textAlign: 'center',
                  borderRadius: '12px',
                  height: '100%',
                }}
              >
                <Typography variant="h4">{t('metrics.referrals.count')}</Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {t('metrics.referrals.label')}
                  </Typography>
                  <Tooltip title={t('metrics.referrals.tooltip')}>
                    <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </Tooltip>
                </Box>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Card
                elevation={8}
                sx={{
                  px: 6,
                  py: 4,
                  textAlign: 'center',
                  borderRadius: '12px',
                  height: '100%',
                }}
              >
                <Typography variant="h4">{t('metrics.commission.amount')}</Typography>
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.light}, ${theme.palette.primary.dark})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {t('metrics.commission.label')}
                  </Typography>
                  <Tooltip title={t('metrics.commission.tooltip')}>
                    <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5 }} />
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Fade>

        {/* Referrals Table */}
        <Fade in timeout={1200}>
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {t('table.title')}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Card elevation={2} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {t('table.headers.date')}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {t('table.headers.status')}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {t('table.headers.commission')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                      {t('table.empty')}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Card>
          </Box>
        </Fade>
      </Paper>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: 600,
            textAlign: 'center',
          }}
        >
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h5" mb={2} fontWeight={700}>
            {t('modal.title')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              value={`${import.meta.env.VITE_FRONTEND_BASE_URL}?ref=${user?.referralCode}`}
              InputProps={{ readOnly: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_FRONTEND_BASE_URL}?ref=${user?.referralCode}`,
                );
              }}
              sx={{
                color: theme.palette.background.paper,
                backgroundColor: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.palette.text.secondary },
              }}
            >
              {t('modal.copy')}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              placeholder={t('modal.inviteInput')}
              value={inviteEmail}
              error={emailError}
              helperText={emailError ? t('modal.invalidEmail') : ''}
              onChange={(e) => {
                setInviteEmail(e.target.value);
                setEmailError(false);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleInvite}
              sx={{
                color: theme.palette.background.paper,
                backgroundColor: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.palette.text.secondary },
              }}
            >
              {t('modal.inviteButton')}
            </Button>
          </Box>

          {inviteSuccess && (
            <Typography variant="body2" color="success.main" textAlign="left" sx={{ mb: 2 }}>
              {t('modal.inviteSuccess')}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
