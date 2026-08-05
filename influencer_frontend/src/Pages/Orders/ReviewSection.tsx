import { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, ButtonGroup, useTheme } from '@mui/material';
import { useUser } from '../../Context/useUser';
import { createBrandReview } from '../../services/brandService';
import { createCreatorReview } from '../../services/creator.service';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

export default function ReviewSection({
  currentUserId,
  otherUserId,
  otherUserName,
  currentOrderId,
  onReviewSubmitted,
}: {
  currentUserId: number;
  otherUserId: number;
  otherUserName: string;
  currentOrderId: number;
  onReviewSubmitted: (orderId: number) => void;
}) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('Orders');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  const [communication, setCommunication] = useState<number | null>(null);
  const [timeComplete, setTimeComplete] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const [comments, setComments] = useState('');
  const { user } = useUser();

  const handleSubmit = async () => {
    if (!communication || !timeComplete || !service) {
      alert('Please provide all ratings before submitting.');
      return;
    }
    try {
      if (user?.role === 'brand') {
        await createBrandReview({
          creatorId: otherUserId,
          brandId: currentUserId,
          communicationRating: communication,
          timeTakenToCompleteOrderRating: timeComplete,
          serviceRating: service,
          comment: comments,
        });
      } else if (user?.role === 'creator') {
        await createCreatorReview({
          creatorId: currentUserId,
          brandId: otherUserId,
          communicationRating: communication,
          timeTakenToCompleteOrderRating: timeComplete,
          serviceRating: service,
          comment: comments,
        });
      }
      alert('Review submitted successfully!');
      setCommunication(null);
      setTimeComplete(null);
      setService(null);
      setComments('');

      onReviewSubmitted(currentOrderId);
    } catch (error) {
      console.error(error);
      alert('Failed to submit review');
    }
  };

  const RatingButtons = ({
    value,
    onChange,
    label,
  }: {
    value: number | null;
    onChange: (rating: number) => void;
    label: string;
  }) => (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body2"
        sx={{
          mb: 1.5,
          fontSize: '14px',
          fontWeight: 400,
          color: theme.palette.text.primary,
          lineHeight: 1.4,
        }}
      >
        {label}
      </Typography>
      <ButtonGroup variant="contained" sx={{ gap: 0.5 }}>
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            onClick={() => onChange(rating)}
            sx={{
              minWidth: '32px',
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              backgroundColor: value === rating ? theme.palette.text.primary : 'white',
              color: value === rating ? 'white' : theme.palette.text.primary,
              fontSize: '14px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: value === rating ? theme.palette.text.primary : '#616161',
                color: 'white',
              },
              '&:not(:last-child)': {
                borderRight: 'none',
              },
            }}
          >
            {rating}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );

  return (
    <Paper
      sx={{
        width: 350,
        height: '100%',
        borderRadius: 0,
        borderRight: 1,
        borderColor: 'grey.300',
        direction: direction,
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'grey.200' }}>
        <Typography variant="h6" fontWeight="bold" mb={0}>
          {t('reviewSection.title')}
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <RatingButtons
          label={t('reviewSection.communication', { otherUserName })}
          value={communication}
          onChange={setCommunication}
        />

        <RatingButtons
          label={t('reviewSection.timeComplete')}
          value={timeComplete}
          onChange={setTimeComplete}
        />

        <RatingButtons
          label={t('reviewSection.service', { otherUserName })}
          value={service}
          onChange={setService}
        />

        <Box sx={{ mb: 3 }}>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder={t('reviewSection.commentsPlaceholder', { otherUserName })}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                fontSize: '14px',
                '& fieldset': {
                  borderColor: '#ddd',
                },
                '&:hover fieldset': {
                  borderColor: '#bbb',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#999',
                opacity: 1,
                fontSize: '14px',
              },
            }}
          />
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          sx={{
            backgroundColor: theme.palette.text.primary,
            color: 'white',
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 500,
            py: 1.5,
            borderRadius: 1,
            '&:hover': {
              backgroundColor: theme.palette.text.secondary,
            },
          }}
        >
          {t('reviewSection.submit')}
        </Button>
      </Box>
    </Paper>
  );
}
