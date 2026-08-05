import { useState, useEffect } from 'react';
import { Box, Typography, Avatar, Rating, CircularProgress, Paper, Button } from '@mui/material';
import { ChatBubbleOutline, AccessTime, CheckCircle } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import type { Review } from '../../Types/Creator';
import { getBrandReviews } from '../../services/brandService';
import { useUser } from '../../Context/useUser';
import { getCreatorReviews } from '../../services/creator.service';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

// Styled components
const StatsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(3),
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: '#fafafa',
  border: '1px solid #e0e0e0',
}));

const CreatorInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};

const getAvatarColor = (name: string): string => {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const calculateOverallRating = (reviews: Review[]): number => {
  if (!reviews.length) return 0;
  const total = reviews.reduce(
    (acc, review) =>
      acc +
      review.communicationRating +
      review.timeTakenToCompleteOrderRating +
      review.serviceRating,
    0,
  );
  return Number((total / (reviews.length * 3)).toFixed(1));
};

const calculateAverageRating = (reviews: Review[], ratingType: keyof Review): number => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((acc, review) => acc + (review[ratingType] as number), 0);
  return Number((total / reviews.length).toFixed(1));
};

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const { user } = useUser();

  const { t, i18n } = useTranslation('Reviews');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';

  useEffect(() => {
    const fetchReviews = async () => {
      if (typeof user?.id !== 'number') {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        if (user.role === 'brand') {
          const data = await getBrandReviews(user?.id);
          setReviews(data);
        } else if (user.role === 'creator') {
          const data = await getCreatorReviews(user?.id);
          setReviews(data);
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user?.id]);

  const toggleExpanded = (reviewId: number) => {
    setExpandedReviews((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <Box
        sx={{
          my: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!reviews.length) {
    return (
      <Box sx={{ my: 4, direction: direction }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
          {t('noReviewsTitle')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          {t('noReviewsMessage')}
        </Typography>
      </Box>
    );
  }

  // Calculate statistics
  const overallRating = calculateOverallRating(reviews);
  const communicationAvg = calculateAverageRating(reviews, 'communicationRating');
  const timelinessAvg = calculateAverageRating(reviews, 'timeTakenToCompleteOrderRating');
  const satisfactionAvg = calculateAverageRating(reviews, 'serviceRating');

  return (
    <Box sx={{ my: 4, maxWidth: 800, direction: direction }}>
      {/* Header with overall stats */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {t('header', { count: reviews.length })}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={overallRating}
              precision={0.1}
              readOnly
              size="small"
              sx={{ color: '#ffd700' }}
            />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#2E7D32' }}>
              {overallRating}
            </Typography>
          </Box>
        </Box>

        {/* Rating breakdown */}
        <StatsContainer>
          <StatItem>
            <ChatBubbleOutline sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('communication')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {communicationAvg}
            </Typography>
          </StatItem>

          <StatItem>
            <AccessTime sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('timeliness')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {timelinessAvg}
            </Typography>
          </StatItem>

          <StatItem>
            <CheckCircle sx={{ color: 'text.secondary', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {t('satisfaction')}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {satisfactionAvg}
            </Typography>
          </StatItem>
        </StatsContainer>
      </Box>
      {/* Individual reviews */}
      <Box>
        {reviews.map((review) => {
          const avgRating =
            (review.communicationRating +
              review.timeTakenToCompleteOrderRating +
              review.serviceRating) /
            3;
          const isExpanded = expandedReviews.has(review.id);
          const shouldTruncate = review.comment && review.comment.length > 150;

          const reviewer = user?.role === 'brand' ? review.creator : review.brand;

          return (
            <ReviewCard key={review.id} elevation={0}>
              <CreatorInfo>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: getAvatarColor(reviewer.name),
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'white',
                  }}
                >
                  {getInitials(reviewer.name)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {reviewer.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating
                      value={avgRating}
                      precision={0.1}
                      readOnly
                      size="small"
                      sx={{ color: '#ffd700' }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      • {formatDate(review.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </CreatorInfo>

              {/* Comment */}
              {review.comment && (
                <Box sx={{ ml: 7, mt: -2 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.primary',
                      lineHeight: 1.6,
                    }}
                  >
                    {shouldTruncate && !isExpanded
                      ? `${review.comment.substring(0, 150)}...`
                      : review.comment}
                  </Typography>

                  {shouldTruncate && (
                    <Button
                      onClick={() => toggleExpanded(review.id)}
                      size="small"
                      sx={{
                        mt: 1,
                        p: 0,
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textDecoration: 'underline',
                      }}
                    >
                      {isExpanded ? t('showLess') : t('showMore')}
                    </Button>
                  )}
                </Box>
              )}
            </ReviewCard>
          );
        })}
      </Box>
    </Box>
  );
}
