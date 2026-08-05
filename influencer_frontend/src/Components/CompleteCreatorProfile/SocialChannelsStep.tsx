import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  useTheme,
  IconButton,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Collapse,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { channels as staticChannels, followerRanges } from '../../enums/Creator-enums';
import { createSocialChannel } from '../../services/completeProfileService';
import { parseFollowers } from '../../utils/formatFollowersNumber';
import { getServices } from '../../services/creator.service';
import type { mediumStepProps, Service } from '../../Types/Creator';
import { useTranslation } from 'react-i18next';
import { isRtl } from '../../i18n/isRtl';

type SocialChannelsStepProps = mediumStepProps & {
  initialChannels?: {
    usernames: { [key: string]: string };
    followers: { [key: string]: string };
  };
  onChannelsChange?: (channels: {
    usernames: { [key: string]: string };
    followers: { [key: string]: string };
  }) => void;
};

export default function SocialChannelsStep({
  userId,
  onContinue,
  onBack,
  initialChannels,
  onChannelsChange,
}: SocialChannelsStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const isArabic = currentLang === 'ar';

  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>(
    initialChannels?.usernames || {},
  );
  const [followers, setFollowers] = useState<{ [key: string]: string }>(
    initialChannels?.followers || {},
  );
  const [channels, setChannels] = useState(staticChannels);

  // Sync changes to parent component using useEffect
  useEffect(() => {
    onChannelsChange?.({ usernames, followers });
  }, [usernames, followers]);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const services = await getServices();
        const platformsFromBackend = services.map((s: Service) => s.platform);
        const updatedChannels = staticChannels.map((ch) => {
          if (platformsFromBackend.includes(ch.key as Service['platform'])) {
            return { ...ch, key: ch.key };
          }
          return ch;
        });
        setChannels(updatedChannels);
      } catch (error) {
        console.error('Error fetching platforms:', error);
      }
    };

    fetchPlatforms();
  }, []);

  const handleToggle = (key: string) => {
    setExpandedChannel((prev) => (prev === key ? null : key));
  };

  const hasChannelData = (key: string) => {
    const hasUsername = usernames[key] && usernames[key].trim() !== '';
    const hasFollowers = followers[key] && followers[key] !== '';
    return hasUsername || hasFollowers;
  };

  const handleChange = (key: string, type: 'username' | 'followers', value: string) => {
    if (type === 'username') {
      setUsernames((prev) => ({ ...prev, [key]: value }));
    } else {
      setFollowers((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleContinue = async () => {
    try {
      for (const key of Object.keys(usernames)) {
        const isAmazonOrWebsite = key === 'Amazon' || key === 'Website';

        const payload: {
          platform: string;
          username?: string;
          followers?: number;
          url?: string;
        } = { platform: key };

        if (isAmazonOrWebsite) {
          payload.url = usernames[key];
        } else {
          payload.username = usernames[key];
          payload.followers = parseFollowers(followers[key]);
        }

        await createSocialChannel(userId, payload);
      }
      onContinue();
    } catch (error) {
      console.error('Failed to save social channels:', error);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 1000 },
        px: { xs: '20px', sm: '80px' },
        py: { xs: '24px', sm: '60px' },
        direction,
        mt: { xs: 10, sm: 7 },
      }}
    >
      {/* Progress Bar */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <LinearProgress
          variant="determinate"
          value={50}
          sx={{
            height: { xs: 6, sm: 10 },
            borderRadius: 5,
            backgroundColor: '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.secondary.main,
            },
          }}
        />
      </Box>

      {/* Back Button */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <IconButton
          onClick={onBack}
          sx={{
            backgroundColor: theme.palette.action.hover,
            borderRadius: '50%',
            p: { xs: 0.75, sm: 1 },
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" sx={{ color: theme.palette.text.primary }} />
        </IconButton>
      </Box>

      {/* Title */}
      <Typography
        variant="h3"
        fontWeight={700}
        mb={{ xs: 3, sm: 4 }}
        sx={{
          fontSize: { xs: '1.2rem', sm: '2rem' },
        }}
      >
        {t('socialChannelsStep.title')}
      </Typography>

      {/* Channels List */}
      <Stack spacing={2} mb={{ xs: 3, sm: 5 }}>
        {channels.map(({ key, icon, hasFollowers }) => (
          <Box key={key} sx={{ width: { xs: '100%', sm: 500 } }}>
            <Button
              variant="outlined"
              fullWidth
              startIcon={icon}
              onClick={() => handleToggle(key)}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                borderRadius: 2,
                paddingY: { xs: 1.2, sm: 1.5 },
                backgroundColor: '#fff',
                borderColor: '#ddd',
                color: '#000',
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '1rem' },
                '&:hover': { backgroundColor: '#f9f9f9', borderColor: '#ccc' },
                '& .MuiButton-startIcon': {
                  ...(isArabic && {
                    marginLeft: '12px',
                    marginRight: '8px',
                  }),
                },
              }}
            >
              {t(`socialChannelsStep.channels.${key}`)}
            </Button>

            <Collapse
              in={expandedChannel === key || !!hasChannelData(key)}
              timeout="auto"
              unmountOnExit
            >
              <Box
                mt={2}
                ml={{ xs: 0, sm: 1 }}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                }}
              >
                <TextField
                  placeholder={
                    key === 'Amazon'
                      ? t('socialChannelsStep.channels.Amazon')
                      : key === 'Website'
                        ? t('socialChannelsStep.channels.Website')
                        : `${t(`socialChannelsStep.channels.${key}`)}`
                  }
                  value={usernames[key] || ''}
                  onChange={(e) => handleChange(key, 'username', e.target.value)}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.938rem', sm: '1rem' },
                    },
                  }}
                />

                {hasFollowers && (
                  <FormControl fullWidth>
                    <InputLabel sx={{ fontSize: { xs: '0.938rem', sm: '1rem' } }}>
                      {t('socialChannelsStep.Followers')}
                    </InputLabel>
                    <Select
                      value={followers[key] || ''}
                      onChange={(e) => handleChange(key, 'followers', e.target.value)}
                      label={t('socialChannelsStep.Followers')}
                      sx={{
                        fontSize: { xs: '0.938rem', sm: '1rem' },
                      }}
                    >
                      {followerRanges.map(({ value }) => (
                        <MenuItem
                          key={value}
                          value={value}
                          sx={{ fontSize: { xs: '0.938rem', sm: '1rem' } }}
                        >
                          {t(`socialChannelsStep.followerRanges.${value}`)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Collapse>
          </Box>
        ))}
      </Stack>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        fullWidth
        variant="contained"
        sx={{
          py: { xs: '12px', sm: '16px' },
          fontSize: { xs: '1rem', sm: '1.2rem' },
          fontWeight: 600,
          borderRadius: { xs: '8px', sm: '10px' },
          backgroundColor: theme.palette.text.primary,
          color: 'white',
          textTransform: 'none',
          boxShadow: 'none',
        }}
      >
        {t('common.continue')}
      </Button>
    </Box>
  );
}
