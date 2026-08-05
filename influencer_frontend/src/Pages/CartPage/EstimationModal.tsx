import { Box, Typography, LinearProgress, Stack } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { useTranslation } from 'react-i18next';

interface Props {
  estimatedInfluencers: string;
  totalInfluencers: number;
  estimatedSpend: number;
  subtotal: number;
}

export const EstimationModal = ({ totalInfluencers, estimatedSpend, subtotal }: Props) => {
  const { t } = useTranslation('cart');
  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        width: '100%',
        height: '100%',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold">
          {t('modal.header')}
        </Typography>
        <Typography variant="body2" mt={1} mb={2}>
          {t('modal.subheader')}
        </Typography>
        <Typography variant="body2" mb={4}>
          {t('modal.projectionInfo')}
        </Typography>

        <Typography variant="h5" fontWeight="bold">
          {t('modal.influencersRange', { min: 2, max: 3 })}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={60}
          sx={{
            height: 8,
            borderRadius: 5,
            backgroundColor: '#444',
            '& .MuiLinearProgress-bar': { backgroundColor: '#fff' },
            mt: 1,
            mb: 1,
          }}
        />
        <Typography variant="caption" color="#aaa">
          {t('modal.totalInfluencers', { count: totalInfluencers })}
        </Typography>

        <Box mt={4}>
          <Typography variant="h5" fontWeight="bold">
            {t('modal.estimatedSpend', { amount: estimatedSpend })}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(estimatedSpend / subtotal) * 100}
            sx={{
              height: 8,
              borderRadius: 5,
              backgroundColor: '#444',
              '& .MuiLinearProgress-bar': { backgroundColor: '#fff' },
              mt: 1,
              mb: 1,
            }}
          />
          <Typography variant="caption" color="#aaa">
            {t('modal.total', { total: subtotal.toLocaleString() })}
          </Typography>
        </Box>
      </Box>

      <Stack direction="row" spacing={1} alignItems="center">
        <LockIcon sx={{ fontSize: 30 }} />
        <Typography variant="caption" fontWeight="bold">
          <strong>{t('modal.paymentProtectionHeader')}</strong>
          <br />
          {t('modal.paymentProtectionDesc')}
        </Typography>
      </Stack>
    </Box>
  );
};
