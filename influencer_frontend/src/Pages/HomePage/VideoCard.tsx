import { useState, useRef } from 'react';
import { Card, CardMedia, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface VideoCardProps {
  src: string;
}

export default function VideoCard({ src }: VideoCardProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
    setVideoPlaying(!videoPlaying);
  };

  return (
    <Card
      sx={{
        width: { md: 250, xs: 200, sm: 200 },
        mx: 1,
        height: 350,
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CardMedia
        component="video"
        ref={videoRef}
        src={src}
        sx={{ objectFit: 'cover', width: '100%', height: '100%' }}
        loop
        muted
      />

      <IconButton
        onClick={handleVideoClick}
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: 1,
        }}
      >
        {videoPlaying ? (
          <PauseIcon sx={{ color: 'white' }} />
        ) : (
          <PlayArrowIcon sx={{ color: 'white' }} />
        )}
      </IconButton>
    </Card>
  );
}
