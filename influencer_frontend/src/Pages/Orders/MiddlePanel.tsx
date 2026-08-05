import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Alert, useTheme, Avatar, Divider } from '@mui/material';
import { getServiceIdById } from '../../services/creator.service';
import type { BookingItem, Creator, User } from '../../Types/Creator';
import type { Brand } from '../../entities/Brand';
import { CheckCircleIcon } from 'lucide-react';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatSection from './ChatSection';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';
import { getBrandById } from '../../services/brandService';

interface MiddlePanelProps {
  user: User;
  selectedCreator: Creator | null;
  selectedBrand: Brand | null;
  filteredOrders: BookingItem[];
  serviceNames: { [key: number]: string };
  setServiceNames: (serviceNames: { [key: number]: string }) => void;
  selectedOrders: BookingItem[];
  otherUser: { id: number; name: string } | null;
  revisionMessage?: string | null;
}

export default function MiddlePanel({
  user,
  selectedCreator,
  selectedBrand,
  filteredOrders,
  serviceNames,
  setServiceNames,
  selectedOrders,
  otherUser,
  revisionMessage,
}: MiddlePanelProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('Orders');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const [currentBrandLogo, setCurrentBrandLogo] = useState<string | null>(null);

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  useEffect(() => {
    async function fetchCurrentBrandLogo() {
      if (user.role === 'brand') {
        try {
          const currentBrand = await getBrandById(user.id);
          setCurrentBrandLogo(currentBrand.logoUrl);
          console.log('logo', currentBrand.logoUrl);
        } catch (err) {
          console.error('Error fetching brand logo:', err);
        }
      }
    }
    fetchCurrentBrandLogo();
  }, [user.id, user.role]);

  useEffect(() => {
    async function fetchServiceNames() {
      if (selectedOrders.length > 0) {
        try {
          const servicePromises = selectedOrders.map(async (order) => {
            const service = await getServiceIdById(order.creatorService.serviceId);
            return { orderId: order.id, serviceName: service?.name || '' };
          });

          const serviceResults = await Promise.all(servicePromises);
          const serviceMap = serviceResults.reduce(
            (acc, { orderId, serviceName }) => {
              if (orderId !== undefined) {
                acc[orderId] = serviceName;
              }
              return acc;
            },
            {} as { [key: number]: string },
          );

          setServiceNames(serviceMap);
        } catch (err) {
          console.error('Error fetching service names:', err);
        }
      } else {
        setServiceNames({});
      }
    }
    fetchServiceNames();
  }, [selectedOrders, setServiceNames]);

  const logoUrl = user.role === 'brand' ? currentBrandLogo : selectedBrand?.logoUrl;

  return (
    <Paper
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: 1,
        borderColor: 'grey.300',
        overflow: 'hidden',
        position: 'relative',
        direction: direction,
      }}
    >
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          {user.role === 'brand' && <>{selectedCreator?.name || selectedCreator?.username}</>}
          {user.role === 'creator' && <>{selectedBrand?.name || selectedBrand?.username}</>}
        </Typography>
      </Box>

      {filteredOrders.length > 0 && (
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 3,
            scrollBehavior: 'smooth',
          }}
        >
          {filteredOrders.map((order, index) => (
            <Box key={order.id} sx={{ mb: index < filteredOrders.length - 1 ? 4 : 0 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                  mt: index > 0 ? 4 : 0,
                  position: 'relative',
                }}
              >
                <Avatar
                  src={logoUrl || undefined}
                  alt={user.role === 'brand' ? user?.name : selectedBrand?.name}
                  sx={{
                    width: 30,
                    height: 30,
                    backgroundColor: !user.logoUrl ? theme.palette.secondary.main : 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 1,
                  }}
                >
                  {user.role === 'brand' ? user?.logoUrl : selectedBrand?.logoUrl}
                  {user.role === 'brand'
                    ? user?.name.charAt(0).toUpperCase()
                    : selectedBrand?.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="grey.800">
                  {user.role === 'brand' && <>{user?.name}</>}
                  {user.role === 'creator' && <>{selectedBrand?.name}</>}
                </Typography>
                <Typography variant="caption" color="grey.500" sx={{ ml: 2 }}>
                  {new Date(order?.createdAt).toISOString().split('.')[0].replace('T', ' ')}
                </Typography>
              </Box>

              <Alert
                severity="success"
                icon={false}
                sx={{
                  p: 0,
                  bgcolor: 'white',
                  border: 1,
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '& .MuiAlert-message': {
                    p: 0,
                    width: '100%',
                  },
                }}
              >
                {/* Header (light green background) */}
                <Box
                  sx={{
                    bgcolor: '#e8f5e8',
                    color: 'success.800',
                    width: '100%',
                    px: 2,
                    py: 1.5,
                    m: 0,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {t('middlePanel.newOrder')} ${order.unitPrice}
                  </Typography>
                </Box>

                {/* Body (white background) */}
                <Box sx={{ px: 3, py: 2, bgcolor: 'white' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {t('middlePanel.description')}
                  </Typography>
                  <Typography variant="body1" color="grey.700" mb={2} sx={{ lineHeight: 1.6 }}>
                    {order.productDescription}
                  </Typography>

                  <Typography variant="h6" fontWeight="bold" mb={1} mt={-1}>
                    {t('middlePanel.contentRequirements')}
                  </Typography>

                  {/* Chips */}
                  <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
                    {/* Left column */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon color="#4caf50" width={16} height={16} />
                        <Typography variant="body2" color="#666" fontSize="14px">
                          {t('middlePanel.postOnPage')}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {order.contentApproval ? (
                          <CheckCircleIcon color="#4caf50" width={16} height={16} />
                        ) : (
                          <CancelIcon sx={{ color: '#f44336', fontSize: 16, mr: 1 }} />
                        )}
                        <Typography variant="body2" color="#666" fontSize="14px">
                          {t('middlePanel.contentApproval')}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Right column */}
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {order.useForAds ? (
                          <CheckCircleIcon color="#4caf50" width={16} height={16} />
                        ) : (
                          <CancelIcon sx={{ color: '#f44336', fontSize: 16, mr: 1 }} />
                        )}
                        <Typography variant="body2" color="#666" fontSize="14px">
                          {t('middlePanel.usedForAds')}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CheckCircleIcon color="#4caf50" width={16} height={16} />
                        <Typography variant="body2" color="#666" fontSize="14px">
                          {t('middlePanel.expectedDelivery', {
                            date: formatDate(order.deliveryDate),
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="h6" fontWeight="bold" mb={0} mt={-3}>
                    {order.creatorService.quantity} {serviceNames[order.id!]}{' '}
                    {order.creatorService.duration &&
                      ` (${order.creatorService.duration} ${order.creatorService.durationUnit})`}
                  </Typography>
                  <Typography variant="body2" color="grey.700" mb={1} fontWeight="medium">
                    {order.contentRequirements}
                  </Typography>
                  <Typography variant="body2" color="grey.700" mb={1} fontWeight="medium">
                    {order.additionalRequirements}
                  </Typography>

                  {/* Action buttons for creators - only for requested orders */}
                </Box>
              </Alert>

              {index < filteredOrders.length - 1 && (
                <Divider sx={{ my: 3, borderColor: 'grey.300' }} />
              )}
            </Box>
          ))}
          <Alert
            severity="info"
            sx={{
              mt: 2,
              bgcolor: '#e8ecf0',
              border: 1,
              borderColor: theme.palette.text.secondary,
            }}
          >
            <Typography variant="body2">
              {t('middlePanel.paymentProtection')}{' '}
              <Button
                variant="text"
                size="small"
                sx={{
                  p: 0,
                  color: 'text.primary',
                  textDecoration: 'underline',
                  minWidth: 'auto',
                }}
              >
                {t('middlePanel.learnMore')}
              </Button>
            </Typography>
          </Alert>
          {otherUser && (
            <Box sx={{ borderTop: 1, borderColor: 'grey.200', mt: 1 }}>
              <ChatSection
                currentUserId={user.id}
                otherUserId={otherUser.id}
                otherUserName={otherUser.name}
                revisionMessage={revisionMessage ?? null}
              />
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}
