import { Box, Typography, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import EmptyNavbar from '../../Components/Navbar/EmptyNavbar';
import theme from '../../theme';
import PlaceOrder from './PlaceOrder';
import SubmitRequirements from './SubmitRequirements';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

export default function CheckoutPage() {
  const { itemIndex } = useParams();
  const index = itemIndex ? parseInt(itemIndex) - 1 : 0;
  const [activeStep, setActiveStep] = useState(0);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [, setCurrentIndex] = useState(index);
  const navigate = useNavigate();

  const { t, i18n } = useTranslation('placeOrder');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const steps = [t('stepOne'), t('stepTwo')];

  useEffect(() => {
    setCurrentIndex(index);
  }, [index]);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.paper, minHeight: '100vh', direction }}>
      <EmptyNavbar />
      <Box sx={{ backgroundColor: '#e8ecf0', py: 2, width: '100%', pt: '85px' }}>
        <Box maxWidth="1200px" mx="auto" px={3}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border:
                    activeStep === 0 ? `2px solid ${theme.palette.success.main}` : '2px solid #ccc',
                  backgroundColor: activeStep === 0 ? '#e8ecf0' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.primary,
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                1
              </Box>
              <Typography
                sx={{
                  fontWeight: activeStep === 0 ? 500 : 400,
                  color:
                    activeStep === 0 ? theme.palette.text.primary : theme.palette.text.secondary,
                  fontSize: '14px',
                  ml: 1,
                }}
              >
                {steps[0]}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border:
                    activeStep === 1 ? `2px solid ${theme.palette.success.main}` : '2px solid #ccc',
                  backgroundColor: activeStep === 1 ? '#e8ecf0' : '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.palette.text.primary,
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                2
              </Box>
              <Typography
                sx={{
                  fontWeight: activeStep === 1 ? 500 : 400,
                  color:
                    activeStep === 1 ? theme.palette.text.primary : theme.palette.text.secondary,
                  fontSize: '14px',
                }}
              >
                {steps[1]}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box maxWidth="1200px" mx="auto" px={3} py={4}>
        {activeStep === 0 && (
          <PlaceOrder
            onBookingCreated={(id: number) => {
              setBookingId(id);
              setActiveStep(1);
              navigate('/checkout/1', { state: { bookingId: id } });
            }}
          />
        )}
        {activeStep === 1 && bookingId && <SubmitRequirements />}
      </Box>
    </Box>
  );
}
