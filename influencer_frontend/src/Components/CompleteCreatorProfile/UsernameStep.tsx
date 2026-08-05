import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, InputAdornment, useTheme } from '@mui/material';
import type { firstStepProps } from '../../Types/Creator';
import { createUsername } from '../../services/completeProfileService';
import { isRtl } from '../../i18n/isRtl';
import { useTranslation } from 'react-i18next';

interface UsernameStepProps extends firstStepProps {
  initialUsername?: string;
  onUsernameChange?: (username: string) => void;
}

export default function UsernameClaim({
  onContinue,
  userId,
  initialUsername = '',
  onUsernameChange,
}: UsernameStepProps) {
  const theme = useTheme();
  const { t, i18n } = useTranslation('creatorSteps');
  const currentLang = i18n.language;
  const direction = isRtl(currentLang) ? 'rtl' : 'ltr';
  const isRtlLang = isRtl(currentLang);
  const [username, setUsername] = useState(initialUsername);

  // Sync with parent state
  useEffect(() => {
    setUsername(initialUsername);
  }, [initialUsername]);

  const handleContinue = async () => {
    if (!username.trim()) {
      alert(t('usernameStep.alert.empty'));
      return;
    } else {
      try {
        await createUsername(userId, username);
        if (onUsernameChange) {
          onUsernameChange(username);
        }
        onContinue();
      } catch (error) {
        console.error('Error creating username:', error);
        alert(t('usernameStep.alert.error'));
      }
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setUsername(cleanValue);
    if (onUsernameChange) {
      onUsernameChange(cleanValue);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 500 },
        px: { xs: '20px', sm: '40px' },
        py: { xs: '24px', sm: '40px' },
        textAlign: 'center',
        direction: direction,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={600}
        mb={2}
        mt={10}
        sx={{
          color: theme.palette.text.primary,
          fontSize: { xs: '1.5rem', sm: '2rem' },
        }}
      >
        {t('usernameStep.title')}
      </Typography>

      <Typography
        variant="body1"
        mb={4}
        sx={{
          color: theme.palette.text.secondary,
          fontSize: { xs: '0.938rem', sm: '1rem' },
          lineHeight: 1.5,
          px: { xs: 1, sm: 0 },
        }}
      >
        {t('usernameStep.description')}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          mb: 4,
          width: { xs: '100%', sm: 500 },
        }}
      >
        <TextField
          fullWidth
          value={username}
          onChange={handleUsernameChange}
          placeholder={t('usernameStep.placeholder')}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.875rem', sm: '1.2rem' },
                    fontWeight: 500,
                  }}
                >
                  collabios.com/
                </Typography>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={handleContinue}
                  variant="contained"
                  sx={{
                    minWidth: { xs: '70px', sm: '80px' },
                    py: { xs: '8px', sm: '12px' },
                    px: { xs: '16px', sm: '24px' },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    borderRadius: '8px',
                    backgroundColor: theme.palette.text.primary,
                    color: 'white',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: theme.palette.text.primary,
                      opacity: 0.9,
                      boxShadow: 'none',
                    },
                  }}
                >
                  {t('usernameStep.claim')}
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': {
              height: { xs: 52, sm: 64 },
              fontSize: { xs: '1rem', sm: '1.2rem' },
              borderRadius: { xs: '26px', sm: '32px' },
              paddingRight: '8px',
              backgroundColor: '#f5f5f5',
              border: 'none',
              direction: 'ltr',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '& .MuiInputBase-input': {
              padding: { xs: '16px 12px 16px 0', sm: '20px 16px 20px 0' },
              textAlign: 'left',
            },
            '& .MuiInputAdornment-positionStart': {
              marginLeft: { xs: '12px', sm: '16px' },
              marginRight: isRtlLang ? '0px' : '0',
            },
            ...(isRtlLang && {
              '& .MuiInputBase-input': {
                padding: { xs: '16px 0 16px', sm: '20px 0 20px' },
                textAlign: 'left',
              },
            }),
          }}
        />
      </Box>
    </Box>
  );
}
