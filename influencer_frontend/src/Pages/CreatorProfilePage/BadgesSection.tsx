import { Box, Typography, Avatar, Stack } from '@mui/material';
import { Star, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Creator } from '../../Types/Creator';

const BadgeSection: React.FC<{ creator: Creator }> = ({ creator }) => {
  const { isTopCreator = true, respondsFast = true } = creator;
  const name = creator?.name ?? '';

  const styles = {
    avatar: {
      bgcolor: 'white',
      width: 40,
      height: 40,
      mr: 2,
    },
  };
  const { t } = useTranslation('profile');
  return (
    <Stack spacing={3}>
      {isTopCreator && (
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar sx={styles.avatar}>
            <Box position="relative">
              <Star style={{ width: 20, height: 20 }} className="text-pink-600" />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: 4,
                  width: 12,
                  height: 12,
                  bgcolor: 'pink.600',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 4,
                    bgcolor: 'white',
                    borderRadius: '50%',
                  }}
                />
              </Box>
            </Box>
          </Avatar>

          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              {name} {t('profile.topCreator')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('profile.topCreatorDescription')}
            </Typography>
          </Box>
        </Box>
      )}

      {respondsFast && (
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Avatar sx={styles.avatar}>
            <Zap style={{ width: 20, height: 20 }} className="text-green-600" />
          </Avatar>

          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="text.primary">
              {name} {t('profile.respondsFast')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {name} {t('profile.respondsFastDescription')}
            </Typography>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default BadgeSection;
