import { Box, Grid, Typography, Card, CardMedia, CardActionArea } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { PortfolioItem } from '../../Types/Creator';

const PortfolioSection: React.FC<{ PortfolioItems: PortfolioItem[] }> = ({ PortfolioItems }) => {
  const { t } = useTranslation('profile');
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());

  const handleVideoToggle = (itemId: string, video: HTMLVideoElement) => {
    if (video.paused) {
      video.play();
      setPlayingVideos((prev) => new Set(prev).add(itemId));
    } else {
      video.pause();
      setPlayingVideos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const isVideo = (item: PortfolioItem): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some((ext) => item.url.toLowerCase().includes(ext));
  };

  return (
    <Box display="flex" flexDirection="column" gap={3} bgcolor="Background.paper">
      <Typography variant="h5" fontWeight={700}>
        {t('profile.portfolio')}
      </Typography>

      <Grid container spacing={2}>
        {PortfolioItems.map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 0.5,
                overflow: 'hidden',
                position: 'relative',
                '&:hover .video-overlay': {
                  opacity: 1,
                },
              }}
            >
              {isVideo(item) ? (
                <>
                  <Box
                    component="video"
                    src={item.url}
                    muted
                    loop
                    preload="metadata"
                    sx={{
                      width: '100%',
                      height: {
                        xs: 200,
                        sm: 250,
                        md: 400,
                      },
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      display: 'block',
                    }}
                    className="media"
                  />

                  <Box
                    className="overlay video-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: playingVideos.has(String(item.id)) ? 0 : 1,
                      transition: 'opacity 0.3s ease',
                    }}
                    onClick={(e) => {
                      const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                      handleVideoToggle(String(item.id), video);
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                    >
                      {playingVideos.has(String(item.id)) ? (
                        <Box sx={{ display: 'flex', gap: '3px' }}>
                          <Box
                            sx={{
                              width: '4px',
                              height: '16px',
                              backgroundColor: 'black',
                            }}
                          />
                          <Box
                            sx={{
                              width: '4px',
                              height: '16px',
                              backgroundColor: 'black',
                            }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            width: 0,
                            height: 0,
                            borderLeft: '12px solid black',
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent',
                            marginLeft: '3px',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </>
              ) : (
                <CardActionArea>
                  <CardMedia
                    component="img"
                    src={item.url}
                    alt={`Portfolio item ${item.id}`}
                    sx={{
                      width: '100%',
                      height: {
                        xs: 200,
                        sm: 250,
                        md: 400,
                      },
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                    }}
                    className="media"
                  />

                  <Box
                    className="overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      bgcolor: 'rgba(0,0,0,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: 0,
                          height: 0,
                          borderLeft: '8px solid black',
                          borderTop: '6px solid transparent',
                          borderBottom: '6px solid transparent',
                          marginLeft: '2px',
                        }}
                      />
                    </Box>
                  </Box>
                </CardActionArea>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PortfolioSection;
