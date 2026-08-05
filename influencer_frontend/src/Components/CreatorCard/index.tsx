import { Card, CardMedia, Typography, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import GroupsIcon from '@mui/icons-material/Groups';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Price, Review } from '../../Types/Creator';
import { formatFollowerCount } from '../../utils/formatFollowersNumber';
import { getCreatorByUsername, getCreatorReviews } from '../../services/creator.service';

const platformIcons = {
  INSTAGRAM: (
    <img src="/SocialIcons/instagram.svg" alt="instagram" style={{ width: 18, height: 18 }} />
  ),
  YOUTUBE: <img src="/SocialIcons/youtube.svg" alt="youtube" style={{ width: 18, height: 18 }} />,
  TWITTER: <img src="/SocialIcons/twitter.svg" alt="Twitter" style={{ width: 18, height: 18 }} />,
  TIKTOK: <img src="/SocialIcons/tiktok.svg" alt="TikTok" style={{ width: 18, height: 18 }} />,
  TWITCH: <img src="/SocialIcons/twitch.svg" alt="Twitch" style={{ width: 18, height: 18 }} />,
};

interface CreatorCardProps {
  imageUrl: string;
  name: string;
  prices: Price[];
  title: string;
  location: string;
  username: string;
}

export default function CreatorCard({
  imageUrl,
  name,
  prices,
  title,
  location,
  username,
}: CreatorCardProps) {
  const navigate = useNavigate();
  const [maxFollowers, setMaxFollowers] = useState<number>(0);
  const [maxFollowersPlatform, setMaxFollowersPlatform] = useState<string>('');

  const minPrice = prices?.length ? Math.min(...prices.map((p) => p.price)) : undefined;
  const [reviews, setReviews] = useState<Review[]>([]);

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
  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const currentCreator = await getCreatorByUsername(username);
        if (currentCreator?.socialChannels?.length) {
          const maxFollowersChannel = currentCreator.socialChannels.reduce((max, channel) =>
            (channel.followers ?? 0) > (max.followers ?? 0) ? channel : max,
          );
          setMaxFollowers(maxFollowersChannel.followers ?? 0);
          setMaxFollowersPlatform(maxFollowersChannel.platform);
        }
        const data = await getCreatorReviews(currentCreator.id);
        setReviews(data);
      } catch (error) {
        console.error('Error fetching creator data:', error);
        setMaxFollowers(0);
        setMaxFollowersPlatform('');
      }
    };

    if (username) {
      fetchCreatorData();
    }
  }, [username]);

  const handleClick = () => {
    if (username) {
      navigate(`/${username.split(' ').join('-')}`);
    }
  };

  const getPlatformIcon = () => {
    const platformKey = maxFollowersPlatform.toUpperCase() as keyof typeof platformIcons;
    return platformIcons[platformKey] || <GroupsIcon sx={{ fontSize: 16, color: 'white' }} />;
  };

  return (
    <Card
      sx={{
        height: 300,
        width: 250,
        borderRadius: 2,
        position: 'relative',
        mb: 5,
        cursor: 'pointer',
        boxShadow: 'none',
        overflow: 'hidden',
        '&:hover': {
          boxShadow: 'none',
          transform: 'none',
          elevation: 0,
        },
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        sx={{
          height: 'calc(100% - 60px)',
          width: '100%',
          objectFit: 'cover',
          borderRadius: '8px 8px 16px 16px',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
        image={imageUrl}
        alt={name}
      />

      {/* Followers Count */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 105,
          left: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          backgroundColor: 'white',
          borderRadius: 1,
          px: 0.5,
          py: 0.1,
        }}
      >
        {getPlatformIcon()}
        <Typography variant="body2" sx={{ color: 'black', fontSize: '0.7rem', fontWeight: 'bold' }}>
          {formatFollowerCount(maxFollowers)}
        </Typography>
      </Box>

      {/* Name and Rating */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontSize: '0.8rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {name}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.3}>
          <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
          <Typography
            variant="body2"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            }}
          >
            {calculateOverallRating(reviews)}{' '}
          </Typography>
        </Box>
      </Box>

      {/* Bottom section outside image */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* First row: description + price */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.primary',
              fontSize: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>

          {minPrice && (
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 'bold',
                fontSize: '1rem',
                ml: 1,
                flexShrink: 0,
              }}
            >
              ${minPrice}
            </Typography>
          )}
        </Box>

        {/* Second row: location */}
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.65rem',
            mt: -0.5,
          }}
        >
          {location}
        </Typography>
      </Box>
    </Card>
  );
}
