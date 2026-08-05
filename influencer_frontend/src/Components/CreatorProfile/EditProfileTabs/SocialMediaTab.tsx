import React, { useState } from 'react';
import {
  Box,
  Stack,
  TextField,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import type { SocialChannel } from '../../../Types/Creator';
import {
  createSocialChannel,
  updateSocialChannel,
  deleteSocialChannel,
} from '../../../services/socialChannelService';
import { Instagram, Youtube, Globe, Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  initialChannels: SocialChannel[];
  userId: number;
  role: 'creator' | 'brand';
}

const CREATOR_PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Twitter',
  'Twitch',
  'Amazon',
  'Website',
] as const;
const BRAND_PLATFORMS = ['Website', 'Instagram', 'TikTok', 'YouTube', 'Twitter'] as const;

const FOLLOWER_RANGES = [
  { label: '0-1k', min: 0, max: 1000 },
  { label: '1k-10k', min: 1000, max: 10000 },
  { label: '10k-50k', min: 10000, max: 50000 },
  { label: '50k-100k', min: 50000, max: 100000 },
  { label: '100k-500k', min: 100000, max: 500000 },
  { label: '500k-1m', min: 500000, max: 1000000 },
  { label: '1m-5m', min: 1000000, max: 5000000 },
  { label: '5m-10m', min: 5000000, max: 10000000 },
  { label: '10m+', min: 10000000, max: Infinity },
];

const getRangeLabel = (followers: number) => {
  const range = FOLLOWER_RANGES.find((r) => followers >= r.min && followers < r.max);
  return range ? range.label : '';
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  Instagram: <Instagram size={18} />,
  TikTok: <Music2 size={18} />,
  YouTube: <Youtube size={18} />,
  Website: <Globe size={18} />,
};

const SocialMediaTab: React.FC<Props> = ({ initialChannels, userId, role }) => {
  const [channels, setChannels] = useState<SocialChannel[]>(initialChannels);
  const [toastOpen, setToastOpen] = useState(false);
  const [loading] = useState(false);
  const { t } = useTranslation('common');

  const handleChange = (index: number, field: keyof SocialChannel, value: string | number) => {
    const updated = [...channels];
    updated[index] = { ...updated[index], [field]: value };
    setChannels(updated);
  };

  const handleDelete = async (channel: SocialChannel, index: number) => {
    if (channel.id) await deleteSocialChannel(channel.id);
    const updated = [...channels];
    updated.splice(index, 1);
    setChannels(updated);
  };

  const handleAdd = (platform: string) => {
    setChannels([...channels, { platform, username: '', url: '', followers: 0 } as SocialChannel]);
  };

  const handleSave = async () => {
    for (const ch of channels) {
      if (ch.id) {
        await updateSocialChannel(ch.id, {
          platform: ch.platform,
          username: ch.username ?? '',
          url: ch.url ?? '',
          followers: ch.followers,
        });
      } else {
        await createSocialChannel(
          userId,
          {
            platform: ch.platform,
            username: ch.username ?? '',
            url: ch.url ?? '',
            followers: ch.followers ?? 0,
          },
          role,
        );
      }
    }
    setToastOpen(true);
  };
  const allowedPlatforms = role === 'creator' ? CREATOR_PLATFORMS : BRAND_PLATFORMS;
  const availablePlatforms = allowedPlatforms.filter(
    (p) => !channels.some((c) => c.platform === p),
  );

  return (
    <Box>
      <Stack spacing={4}>
        {channels.map((channel, index) => {
          const isUrlPlatform = channel.platform === 'Website' || channel.platform === 'Amazon';

          return (
            <Box key={index}>
              <Typography fontWeight="bold" mb={1}>
                {channel.platform}
              </Typography>

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  fullWidth
                  placeholder={
                    isUrlPlatform
                      ? `${channel.platform} ${t('url')}`
                      : `${channel.platform} ${t('username')}`
                  }
                  value={isUrlPlatform ? channel.url || '' : channel.username || ''}
                  onChange={(e) =>
                    handleChange(index, isUrlPlatform ? 'url' : 'username', e.target.value)
                  }
                />

                {!isUrlPlatform && role === 'creator' && (
                  <TextField
                    select
                    fullWidth
                    value={getRangeLabel(channel.followers ?? 0)}
                    onChange={(e) => {
                      const selectedRange = FOLLOWER_RANGES.find((r) => r.label === e.target.value);
                      handleChange(index, 'followers', selectedRange?.min ?? 0);
                    }}
                  >
                    {FOLLOWER_RANGES.map((r) => (
                      <MenuItem key={r.label} value={r.label}>
                        {r.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                <IconButton
                  onClick={() => handleDelete(channel, index)}
                  sx={{
                    border: '0.5px solid grey',
                    color: 'black',
                    borderRadius: 1.5,
                    width: 50,
                    height: 50,
                    flexShrink: 0,
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Stack>
            </Box>
          );
        })}

        {availablePlatforms.map((platform) => (
          <Button
            key={platform}
            onClick={() => handleAdd(platform)}
            startIcon={PLATFORM_ICONS[platform]}
            sx={{
              justifyContent: 'flex-start',
              textTransform: 'none',
              border: '1px solid grey',
              color: 'black',
            }}
          >
            {t('add')} {platform}
          </Button>
        ))}
      </Stack>

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          sx={{ backgroundColor: 'black', color: 'white' }}
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : t('save')}
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
          {t('saved_successfully')}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialMediaTab;
