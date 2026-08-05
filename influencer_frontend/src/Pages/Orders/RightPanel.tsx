import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  useTheme,
  Divider,
  TextField,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import type { BookingItem, Creator, Deliverable, User } from '../../Types/Creator';
import React, { useState } from 'react';
import { Close as CloseIcon } from '@mui/icons-material';
import { uploadFiles, uploadLinks } from '../../services/creator.service';
import { approveOrder, getDeliverablesByBookingItem } from '../../services/brandService'; // Updated function name
import { DownloadIcon } from 'lucide-react';
import ReviewSection from './ReviewSection';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

interface RightPanelProps {
  user: User;
  filteredOrders: BookingItem[];
  selectedCreator: Creator | null;
  selectedOrders: BookingItem[];
  serviceNames: { [key: number]: string };
  buttonStates: {
    [key: string]: 'default' | 'confirm-accept' | 'confirm-decline' | 'accepted';
  };
  otherUser: { id: number; name: string } | null;
  onButtonClick: (orderId: number, action: 'accept' | 'decline') => void;
  onCompleteClick: (orderId: number) => void;
  onSendRevision: (msg: string) => void;
}

export default function RightPanel({
  user,
  filteredOrders,
  selectedCreator,
  //   selectedOrders,
  serviceNames,
  onCompleteClick,
  buttonStates,
  otherUser,
  onButtonClick,
  onSendRevision,
}: RightPanelProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('Orders');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const [showDeliverables, setShowDeliverables] = React.useState<{ [orderId: number]: boolean }>(
    () => {
      const stored = localStorage.getItem('showDeliverables');
      return stored ? JSON.parse(stored) : {};
    },
  );
  const [showRevisionBox, setShowRevisionBox] = React.useState(false);
  const [declineMessage, setDeclineMessage] = useState('');

  const [fields, setFields] = React.useState<
    { id: number; type: 'files' | 'link'; value: string | File }[]
  >([]);
  const [deliverables, setDeliverables] = React.useState<Deliverable[]>([]);

  const [showReview, setShowReview] = React.useState<{ [orderId: number]: boolean }>(() => {
    const stored = localStorage.getItem('reviewOrderId');
    return stored ? JSON.parse(stored) : {};
  });

  React.useEffect(() => {
    if (user.role === 'brand' && filteredOrders.length > 0) {
      const bookingItemId = filteredOrders[0].id!;
      if (filteredOrders[0].status === 'In Progress' || filteredOrders[0].status === 'Completed') {
        getDeliverablesByBookingItem(bookingItemId).then(setDeliverables).catch(console.error);
      }
    }
  }, [user.role, filteredOrders]);

  const [dev, setDev] = React.useState<Deliverable[]>([]);

  React.useEffect(() => {
    if (user.role === 'creator' && filteredOrders.length > 0) {
      if (filteredOrders.every((order) => order.status === 'In Progress')) {
        const bookingItemId = filteredOrders[0].id!;
        getDeliverablesByBookingItem(bookingItemId).then(setDev).catch(console.error);
      }
    }
  }, [filteredOrders]);

  const handleSubmitDeliverablesClick = (orderId: number) => {
    setShowDeliverables((prev) => {
      const updated = { ...prev, [orderId]: true };
      localStorage.setItem('showDeliverables', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCancelDeliverables = (orderId: number) => {
    setShowDeliverables((prev) => {
      const updated = { ...prev, [orderId]: false };
      localStorage.setItem('showDeliverables', JSON.stringify(updated));
      return updated;
    });
    setFields([]);
  };

  const handleSubmitDeliverables = async () => {
    if (filteredOrders.length === 0) return;
    const bookingItemId = filteredOrders[0].id!;

    try {
      const filesToUpload = fields
        .filter((f) => f.type === 'files' && f.value instanceof File)
        .map((f) => f.value as File);

      if (filesToUpload.length > 0) {
        await uploadFiles(bookingItemId, filesToUpload);
      }

      const linksToUpload = fields
        .filter((f) => f.type === 'link' && typeof f.value === 'string' && f.value.trim())
        .map((f) => f.value as string);

      if (linksToUpload.length > 0) {
        await uploadLinks(bookingItemId, linksToUpload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('showDeliverables');
      setFields([]);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFields((prev) => [...prev, { id: Date.now(), type: 'files', value: file }]);
      e.target.value = '';
    }
  };

  const handleAddLink = () => {
    setFields((prev) => [...prev, { id: Date.now(), type: 'link', value: '' }]);
  };
  const handleFieldChange = (id: number, value: string) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };
  const handleRemoveField = (id: number) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const [links, setLinks] = useState<{ id: number; value: string }[]>([
    { id: Date.now(), value: '' },
  ]);

  const handleAddLinks = () => {
    setLinks((prev) => [...prev, { id: Date.now(), value: '' }]);
  };

  const handleLinkChange = (id: number, value: string) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, value } : link)));
  };

  const handleRemoveLink = (id: number) => {
    if (links.length > 1) {
      setLinks((prev) => prev.filter((link) => link.id !== id));
    }
  };

  const handleSubmit = async () => {
    const validLinks = links.map((link) => link.value.trim()).filter((link) => link !== '');

    if (validLinks.length > 0) {
      const bookingItemId = filteredOrders[0].id!;
      await uploadLinks(bookingItemId, validLinks);
      setShowReview((prev) => {
        const updated = { ...prev, [bookingItemId]: true };
        localStorage.setItem('reviewOrderId', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleDidntPost = () => {
    // Handle the case where creator didn't post anything
    // onCancel();
  };

  const [approved, setApproved] = React.useState<{ [orderId: number]: boolean }>(() => {
    const stored = localStorage.getItem('CompleteOrderId');
    return stored ? JSON.parse(stored) : {};
  });

  const markOrderComplete = async (bookingItemId: number) => {
    try {
      await approveOrder(bookingItemId);

      setShowReview((prev) => {
        const updated = { ...prev, [bookingItemId]: true };
        localStorage.setItem('reviewOrderId', JSON.stringify(updated));
        return updated;
      });

      setApproved((prev) => {
        const updated = { ...prev, [bookingItemId]: true };
        localStorage.setItem('CompleteOrderId', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Error marking order complete:', error);
    }
  };

  if (
    filteredOrders.length > 0 &&
    filteredOrders.every((order) => order.status === 'In Progress') &&
    showDeliverables[filteredOrders[0].id!]
  ) {
    return (
      <Paper
        sx={{
          width: 350,
          height: '100%',
          borderRadius: 0,
          borderRight: 1,
          borderColor: 'grey.300',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          direction: direction,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          {/* Add Files and Add Link buttons */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleAddFileClick}
              sx={{
                flex: 1,
                borderColor: 'grey.400',
                color: 'grey.700',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
              }}
            >
              {t('rightPanel.addFiles')}
            </Button>
            <Button
              variant="outlined"
              onClick={handleAddLink}
              sx={{
                flex: 1,
                borderColor: 'grey.400',
                color: 'grey.700',
                textTransform: 'none',
                borderRadius: 2,
                py: 1.5,
              }}
            >
              {t('rightPanel.addLink')}
            </Button>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>

          {/* Render multiple fields */}
          {fields.map((field) => (
            <TextField
              key={field.id}
              fullWidth
              type="text"
              placeholder={
                field.type === 'files'
                  ? t('rightPanel.uploadedFile')
                  : t('rightPanel.urlPlaceholder')
              }
              value={field.type === 'files' ? (field.value as File).name : (field.value as string)}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              variant="outlined"
              InputProps={{
                readOnly: field.type === 'files',
                endAdornment: (
                  <IconButton size="small" onClick={() => handleRemoveField(field.id)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          ))}

          {/* Submit button */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmitDeliverables}
            sx={{
              bgcolor: 'grey.900',
              color: 'white',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              mb: 2,
              '&:hover': {
                bgcolor: 'grey.800',
              },
            }}
          >
            {dev.length > 0 ? t('rightPanel.addMoreDeliverables') : t('rightPanel.submit')}{' '}
          </Button>

          {/* Cancel button */}
          <Button
            fullWidth
            variant="text"
            onClick={() => handleCancelDeliverables(filteredOrders[0].id!)}
            sx={{
              color: 'grey.500',
              textTransform: 'none',
            }}
          >
            {t('rightPanel.cancel')}
          </Button>
        </Box>
      </Paper>
    );
  }

  if (otherUser && showReview[filteredOrders[0]?.id]) {
    return (
      <ReviewSection
        currentUserId={user.id}
        otherUserId={otherUser.id}
        otherUserName={otherUser.name}
        currentOrderId={filteredOrders[0].id}
        onReviewSubmitted={(orderId) => {
          setShowReview((prev) => {
            const updated = { ...prev };
            delete updated[orderId];
            localStorage.setItem('reviewOrderId', JSON.stringify(updated));
            return updated;
          });
        }}
      />
    );
  }

  // Original panel content
  return (
    <Paper
      sx={{
        width: 350,
        height: '100%',
        borderRadius: 0,
        borderRight: 1,
        borderColor: 'grey.300',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {t('rightPanel.orderTitle')}
        </Typography>
        <Divider sx={{ mx: -2, my: -1, mb: 2 }} />
        {filteredOrders.length > 0 && (
          <>
            {(() => {
              const currentOrder = filteredOrders[0];

              if (currentOrder.status === 'Requested') {
                return (
                  <>
                    <Alert
                      severity="warning"
                      sx={{
                        mt: -2,
                        mb: 1,
                        mx: -2,
                        bgcolor: '#FDF2E9',
                        border: 0,
                        borderRadius: 0,
                        '& .MuiAlert-icon': {
                          display: 'none',
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="400"
                        sx={{
                          color: '#92400E',
                          mb: 0.5,
                        }}
                      >
                        {t('rightPanel.pending')}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6B7280',
                          fontSize: '0.875rem',
                          lineHeight: 1.4,
                        }}
                      >
                        {user.role === 'brand' &&
                          t('rightPanel.brandPendingMessage', {
                            creatorName: selectedCreator?.name || selectedCreator?.username,
                          })}
                        {user.role === 'creator' && t('rightPanel.creatorPendingMessage')}
                      </Typography>
                    </Alert>

                    {user.role === 'creator' && (
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          sx={{
                            flex: 1,
                            color: 'white',
                            backgroundColor: theme.palette.text.primary,
                            height: 28,
                            minHeight: 'unset',
                            padding: '20px 18px',
                          }}
                          onClick={() => onButtonClick(filteredOrders[0].id!, 'accept')}
                        >
                          {buttonStates[filteredOrders[0].id!] === 'confirm-accept'
                            ? t('rightPanel.confirmAccept')
                            : t('rightPanel.accept')}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => onButtonClick(filteredOrders[0].id!, 'decline')}
                          sx={{
                            flex: 1,
                            color: theme.palette.text.primary,
                            backgroundColor: 'white',
                            borderColor: theme.palette.text.primary,
                            height: 28,
                            minHeight: 'unset',
                            padding: '20px 18px',
                          }}
                        >
                          {buttonStates[filteredOrders[0].id!] === 'confirm-decline'
                            ? t('rightPanel.confirmDecline')
                            : t('rightPanel.decline')}
                        </Button>
                      </Box>
                    )}
                  </>
                );
              }
              if (user.role === 'creator' && filteredOrders[0]?.status === 'Completed') {
                return (
                  <>
                    <Alert
                      severity="warning"
                      sx={{
                        mt: -2,
                        mb: 0.5,
                        mx: -2,
                        bgcolor: '#FDF2E9',
                        border: 0,
                        borderRadius: 0,
                        '& .MuiAlert-icon': {
                          display: 'none',
                        },
                        py: 0,
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{
                          color: 'grey.900',
                          mb: 0.5,
                          fontSize: '1rem',
                        }}
                      >
                        {t('rightPanel.submitPostLinkTitle')}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'grey.600',
                          mb: 1,
                          textAlign: 'center',
                          fontSize: '0.67rem',
                        }}
                      >
                        {t('rightPanel.submitPostLinkDescription', {
                          quantity: filteredOrders[0].creatorService.quantity,
                          serviceName: serviceNames[filteredOrders[0].id!],
                          duration: filteredOrders[0].creatorService.duration,
                          durationUnit: filteredOrders[0].creatorService.durationUnit,
                        })}
                      </Typography>
                    </Alert>
                    {/* Link Input Fields */}
                    <Box sx={{ mb: 3, mt: 2 }}>
                      {links.map((link) => (
                        <Box key={link.id} sx={{ mb: 2 }}>
                          <TextField
                            fullWidth
                            placeholder="Url/Link to content (https://instagram.com/123)"
                            value={link.value}
                            onChange={(e) => handleLinkChange(link.id, e.target.value)}
                            variant="outlined"
                            InputProps={{
                              endAdornment: links.length > 1 && (
                                <IconButton
                                  size="small"
                                  onClick={() => handleRemoveLink(link.id)}
                                  sx={{ color: 'grey.400' }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              ),
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                                backgroundColor: 'white',
                                '& fieldset': {
                                  borderColor: '#E0E0E0',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#BDBDBD',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                },
                              },
                              '& .MuiInputBase-input': {
                                color: 'grey.700',
                                fontSize: '0.875rem',
                                py: 1.5,
                              },
                              '& .MuiInputBase-input::placeholder': {
                                color: '#9E9E9E',
                                opacity: 1,
                              },
                            }}
                          />
                        </Box>
                      ))}

                      {/* Add Another Link Button */}
                      <Button
                        variant="text"
                        onClick={handleAddLinks}
                        sx={{
                          ml: 27,
                          mt: -2,
                          color: theme.palette.text.primary,
                          textTransform: 'none',
                          fontSize: '0.7rem',
                          fontWeight: 400,
                          p: 0,
                          justifyContent: 'flex-start',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            textDecoration: 'none',
                          },
                        }}
                      >
                        {t('rightPanel.addAnotherLink')}{' '}
                      </Button>
                    </Box>
                    {/* Submit Links Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={links.every((link) => !link.value.trim())}
                      sx={{
                        color: 'white',
                        backgroundColor: theme.palette.text.primary,
                        textTransform: 'none',
                        borderRadius: 1,
                        py: 1.5,
                        mb: 2,
                        height: 28,
                        minHeight: 'unset',
                        padding: '20px 10px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        '&:hover': {
                          bgcolor: '#1A1A1A',
                        },
                        '&:disabled': {
                          color: 'white',
                          backgroundColor: theme.palette.text.primary,
                        },
                      }}
                    >
                      {t('rightPanel.submitLinks')}
                    </Button>

                    {/* I didn't post anything link */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#9E9E9E',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        '&:hover': {
                          color: 'grey.600',
                        },
                      }}
                      onClick={handleDidntPost}
                    >
                      <Typography onClick={handleDidntPost}>{t('rightPanel.didntPost')}</Typography>
                    </Typography>
                  </>
                );
              }

              if (currentOrder.status === 'In Progress' && deliverables.length === 0) {
                return (
                  <Alert
                    severity="info"
                    sx={{
                      mt: -2,
                      mb: 1,
                      mx: -2,
                      bgcolor: '#e8f0fe',
                      border: 0,
                      borderRadius: 0,
                      '& .MuiAlert-icon': {
                        display: 'none',
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="400"
                      sx={{
                        color: '#1e3a8a',
                        mb: 0.5,
                      }}
                    >
                      {t('rightPanel.inProgressTitle')}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#6B7280',
                        fontSize: '0.875rem',
                        lineHeight: 1.4,
                      }}
                    >
                      {user.role === 'brand' &&
                        t('rightPanel.brandInProgressMessage', {
                          creatorName: selectedCreator?.name || selectedCreator?.username,
                        })}
                      {user.role === 'creator' && t('rightPanel.creatorInProgressMessage')}
                    </Typography>
                  </Alert>
                );
              }
              return null;
            })()}

            {/* Submit Deliverables button - only show for in-progress orders */}
            {user.role === 'creator' &&
              filteredOrders.length > 0 &&
              filteredOrders[0].status === 'In Progress' && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSubmitDeliverablesClick(filteredOrders[0].id!)}
                    sx={{
                      flex: 1,
                      color: 'white',
                      backgroundColor: theme.palette.text.primary,
                      height: 28,
                      minHeight: 'unset',
                      padding: '20px 18px',
                    }}
                  >
                    {dev.length > 0
                      ? t('rightPanel.addMoreDeliverables')
                      : t('rightPanel.submitDeliverables')}{' '}
                  </Button>
                </Box>
              )}

            {/* Show deliverables for brands */}
            {user.role === 'brand' &&
              deliverables.length > 0 &&
              (filteredOrders[0].status === 'In Progress' ||
                filteredOrders[0].status === 'Completed') && (
                <>
                  <Typography variant="h6" fontWeight="bold" mt={2} mb={1}>
                    {t('rightPanel.deliverablesTitle')}
                  </Typography>
                  <Divider sx={{ mx: -2, my: -1, mb: 2 }} />
                  {deliverables.map((deliverable) => (
                    <Box key={deliverable.id} sx={{ mb: 2 }}>
                      {/* Links */}
                      {Array.isArray(deliverable.links) &&
                        deliverable.links.length > 0 &&
                        deliverable.links.map((link, idx) => (
                          <Paper
                            key={idx}
                            variant="outlined"
                            sx={{ p: 1.5, mb: 1, bgcolor: 'grey.50' }}
                          >
                            <MuiLink
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              underline="hover"
                              sx={{
                                display: 'block',
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {link}
                            </MuiLink>
                          </Paper>
                        ))}

                      {/* Files */}
                      {Array.isArray(deliverable.files) &&
                        deliverable.files.length > 0 &&
                        deliverable.files.map((file, idx) => {
                          return (
                            <Paper
                              key={idx}
                              variant="outlined"
                              sx={{
                                p: 1.5,
                                mb: 1,
                                bgcolor: 'grey.50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Box>
                                <Typography variant="body1" fontWeight={500}>
                                  {file.fileName}
                                </Typography>
                              </Box>
                              <IconButton
                                component="a"
                                href={file.url}
                                download={file.fileName}
                                size="small"
                              >
                                <DownloadIcon fontSize="small" />
                              </IconButton>
                            </Paper>
                          );
                        })}
                    </Box>
                  ))}
                  {filteredOrders[0].status === 'In Progress' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                      {!showRevisionBox && (
                        <>
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => onCompleteClick(filteredOrders[0].id!)}
                            sx={{
                              color: 'white',
                              backgroundColor: theme.palette.text.primary,
                              height: 40,
                              borderRadius: 2,
                              textTransform: 'none',
                              '&:hover': {
                                backgroundColor: theme.palette.text.secondary,
                              },
                            }}
                          >
                            {t('rightPanel.acceptDeliverables')}
                          </Button>
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{
                              cursor: 'pointer',
                              textAlign: 'center',
                              color: theme.palette.text.secondary,
                              textDecoration: 'underline',
                              fontWeight: 500,
                              mt: 3,
                              '&:hover': { textDecoration: 'underline' },
                            }}
                            onClick={() => setShowRevisionBox(true)}
                          >
                            {t('rightPanel.requestRevision')}
                          </Typography>
                        </>
                      )}
                      {/* Revision Box */}
                      {showRevisionBox && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                            {t('rightPanel.declineSubmissionTitle')}
                          </Typography>
                          <TextField
                            multiline
                            minRows={4}
                            fullWidth
                            placeholder={t('rightPanel.declineSubmissionPlaceholder')}
                            value={declineMessage}
                            onChange={(e) => setDeclineMessage(e.target.value)}
                          />
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                if (declineMessage.trim()) {
                                  onSendRevision(declineMessage);
                                  setDeclineMessage('');
                                  setShowRevisionBox(false);
                                }
                              }}
                              sx={{
                                color: 'white',
                                backgroundColor: theme.palette.text.primary,
                                flex: 1,
                                textTransform: 'none',
                              }}
                            >
                              {t('rightPanel.send')}
                            </Button>
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => setShowRevisionBox(false)}
                              sx={{
                                color: theme.palette.text.primary,
                                flex: 1,
                                textTransform: 'none',
                              }}
                            >
                              {t('rightPanel.cancel')}
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  )}
                </>
              )}

            {user.role === 'brand' &&
              deliverables.length > 0 &&
              filteredOrders[0].status === 'Completed' &&
              !approved[filteredOrders[0].id!] && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => markOrderComplete(filteredOrders[0].id!)}
                  sx={{
                    flex: 1,
                    color: 'white',
                    backgroundColor: theme.palette.text.primary,
                    height: 28,
                    minHeight: 'unset',
                    padding: '20px 18px',
                    ml: 9,
                  }}
                >
                  {t('rightPanel.markOrderComplete')}
                </Button>
              )}
            {/* Show order details */}
            {(filteredOrders[0].status === 'Requested' ||
              filteredOrders[0].status === 'In Progress') &&
              deliverables.length === 0 && (
                <>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {t('rightPanel.total')}
                  </Typography>
                  <Divider sx={{ mx: -2, my: -1, mb: 0 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="bold" color="grey.900">
                      ${filteredOrders[0].unitPrice}
                    </Typography>
                  </Box>

                  {/* Order details */}
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {t('rightPanel.orderDetails')}
                  </Typography>
                  <Divider sx={{ mx: -2, my: -1, mb: 2 }} />

                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight="bold" mb={0.5}>
                      {t('rightPanel.orderTitle')} {filteredOrders[0].id}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="grey.700"
                      mb={1}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {filteredOrders[0].productDescription?.substring(0, 100)}
                      {filteredOrders[0].productDescription &&
                      filteredOrders[0].productDescription.length > 100
                        ? '...'
                        : ''}
                    </Typography>
                    <Typography variant="caption" color="grey.600">
                      {filteredOrders[0].creatorService.quantity}{' '}
                      {serviceNames[filteredOrders[0].id!] || 'Service'}(
                      {filteredOrders[0].creatorService.duration}{' '}
                      {filteredOrders[0].creatorService.durationUnit})
                    </Typography>
                  </Box>
                </>
              )}
          </>
        )}
      </Box>
    </Paper>
  );
}
