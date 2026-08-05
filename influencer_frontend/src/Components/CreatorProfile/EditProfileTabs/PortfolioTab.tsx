import { Box, Button, Grid, IconButton, styled } from '@mui/material';
import { CloudUploadIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  deletePortfolioFile,
  getPortfolioFiles,
  uploadPortfolioFiles,
} from '../../../services/portfolioService';
import { useUser } from '../../../Context/useUser';
import { Snackbar, Alert } from '@mui/material';
import type { PortfolioItem } from '../../../Types/Creator';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export function PortfolioTab() {
  const [uploadedFiles, setUploadedFiles] = useState<{ id: number; url: string }[]>([]);
  const [playingVideos, setPlayingVideos] = useState<Set<number>>(new Set());
  const { user } = useUser();
  const creatorId = user?.id;
  const [toastOpen, setToastOpen] = useState(false);

  const handleVideoToggle = (fileId: number, video: HTMLVideoElement) => {
    if (video.paused) {
      video.play();
      setPlayingVideos((prev) => new Set(prev).add(fileId));
    } else {
      video.pause();
      setPlayingVideos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  const handleSave = async () => {
    try {
      setToastOpen(true);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  useEffect(() => {
    if (!creatorId) return;
    const fetchData = async () => {
      try {
        const files = await getPortfolioFiles(creatorId);
        setUploadedFiles(files);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [creatorId]);

  const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff'];
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];

  const getFileExtension = (fileName: string): string => {
    return fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!creatorId) return;
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    for (const file of Array.from(selectedFiles)) {
      const ext = getFileExtension(file.name);

      if (imageExtensions.includes(ext) && file.size > MAX_IMAGE_SIZE) {
        alert(`Image "${file.name}" is too large. Max allowed size is 10 MB.`);
        e.target.value = '';
        return;
      }

      if (videoExtensions.includes(ext) && file.size > MAX_VIDEO_SIZE) {
        alert(`Video "${file.name}" is too large. Max allowed size is 500 MB.`);
        e.target.value = '';
        return;
      }
    }

    try {
      const result = await uploadPortfolioFiles(creatorId, selectedFiles);

      setUploadedFiles((prev) => [
        ...prev,
        ...result.map((item) => ({ id: item.id, url: item.url })),
      ]);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!creatorId) return;
    try {
      await deletePortfolioFile(creatorId, fileId);
      setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      setPlayingVideos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const reversedUrls = [...uploadedFiles].reverse();
  const isVideo = (item: PortfolioItem): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    return videoExtensions.some((ext) => item.url.toLowerCase().includes(ext));
  };

  return (
    <>
      <Box>
        <Button
          component="label"
          role={undefined}
          style={{
            width: '100%',
            border: '1px solid black',
            textAlign: 'center',
            color: 'black',
            marginBottom: '4px',
          }}
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Click to upload images or videos
          <VisuallyHiddenInput
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            multiple
          />
        </Button>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {reversedUrls.map((file) => {
            const fullUrl = file.url;

            return (
              <Grid key={file.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    '&:hover .video-overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(file.id)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'white',
                      border: '1px solid #ccc',
                      zIndex: 2,
                    }}
                  >
                    <X size={14} />
                  </IconButton>

                  {isVideo(file) ? (
                    <>
                      <Box
                        component="video"
                        src={fullUrl}
                        muted
                        loop
                        preload="metadata"
                        sx={{
                          width: '100%',
                          height: '100%',
                          aspectRatio: '16/9',
                          borderRadius: '4px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />

                      <Box
                        className="video-overlay"
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
                          opacity: playingVideos.has(file.id) ? 0 : 1,
                          transition: 'opacity 0.3s ease',
                        }}
                        onClick={(e) => {
                          const video = e.currentTarget.previousElementSibling as HTMLVideoElement;
                          handleVideoToggle(file.id, video);
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
                          {playingVideos.has(file.id) ? (
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
                    <img
                      src={fullUrl}
                      alt="Uploaded file preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '4px',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          onClick={handleSave}
          style={{
            color: 'white',
            backgroundColor: 'black',
            borderRadius: '6px',
            marginTop: '40px',
          }}
        >
          Save
        </Button>

        {/* Snackbar for toast */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={() => setToastOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setToastOpen(false)} severity="success" sx={{ width: '100%' }}>
            Portfolio saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
