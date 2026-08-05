import React from 'react';
import { Avatar, Box, Chip, Typography, Stack } from '@mui/material';
import { Star, MapPin } from 'lucide-react';
import BadgeSection from './BadgesSection';
import { useTranslation } from 'react-i18next';
import { getFollowerRange } from '../../utils/formatFollowersNumber';
import type { Creator } from '../../Types/Creator';

const CreatorInfo: React.FC<{ creator: Creator; profilePhotoUrl: string }> = ({
  creator,
  profilePhotoUrl,
}) => {
  const { starRating, receivedReviews, location, description, socialChannels } = creator;

  const name = creator?.name ?? 'testinfluencer';
  const rating = starRating ?? 0;
  const reviewsCount = receivedReviews ?? 0;

  const styles = {
    chip: {
      color: '#358fbd',
      borderColor: 'grey',
      fontSize: '0.775rem',
      fontWeight: 550,
    },
  };

  const { t } = useTranslation('profile');

  return (
    <Box p={3} bgcolor="background.paper">
      <Stack direction="row" spacing={3} mb={4}>
        <Avatar
          src={profilePhotoUrl}
          alt={name}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            fontSize: 24,
          }}
        >
          {!profilePhotoUrl && name ? name[0].toUpperCase() : ''}
        </Avatar>

        <Box flex={1}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1} mx={2}>
            <Typography variant="h5" fontWeight={600} color="text.primary">
              {name}
            </Typography>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Star size={18} style={{ color: '#FFD700', fill: '#FFD700' }} />
              <Typography variant="body2" color="text.primary">
                {rating.toFixed(1)} · {t('profile.reviews', { count: reviewsCount.length })}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} mb={2} mx={2}>
            <MapPin size={16} />
            <Typography variant="body2" color="text.secondary">
              {location}
            </Typography>
          </Stack>

          <Box
            display="flex"
            flexWrap="wrap"
            gap={1} // space between chips
            mx={2}
          >
            {socialChannels
              .filter((channel) => channel.url)
              .map((channel, index) => {
                const platformIcon =
                  {
                    INSTAGRAM: (
                      <img
                        src="/SocialIcons/instagram.svg"
                        alt="instagram"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                    YOUTUBE: (
                      <img
                        src="/SocialIcons/youtube.svg"
                        alt="youtube"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                    TWITTER: (
                      <img
                        src="/SocialIcons/twitter.svg"
                        alt="Twitter"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                    TIKTOK: (
                      <img
                        src="/SocialIcons/tiktok.svg"
                        alt="TikTok"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                    TWITCH: (
                      <img
                        src="/SocialIcons/twitch.svg"
                        alt="Twitch"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                    AMAZON: (
                      <img
                        src="/SocialIcons/amazon.svg"
                        alt="Amazon"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                    WEBSITE: (
                      <img
                        src="/SocialIcons/globe.svg"
                        alt="Website"
                        style={{ width: 18, height: 18 }}
                      />
                    ),
                  }[channel.platform.toUpperCase()] ?? null;

                const followersText = channel.followers
                  ? `${getFollowerRange(channel.followers)} Followers`
                  : '';

                return (
                  <Chip
                    key={index}
                    {...(platformIcon ? { icon: platformIcon } : {})}
                    label={followersText || channel.platform}
                    variant="outlined"
                    color="default"
                    size="small"
                    sx={{ cursor: 'pointer', ...styles.chip }}
                    component="a"
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                );
              })}
          </Box>
        </Box>
      </Stack>

      <BadgeSection creator={creator} />

      <Typography variant="body1" color="text.primary" lineHeight={1.8} sx={{ mt: 2 }}>
        {description}
      </Typography>
    </Box>
  );
};

export default CreatorInfo;
