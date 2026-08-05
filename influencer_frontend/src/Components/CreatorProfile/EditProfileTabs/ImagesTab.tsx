import { useEffect, useState } from 'react';
import { Avatar, Box, Button, IconButton, styled } from '@mui/material';
import { CloudUploadIcon, X } from 'lucide-react';
import { useUser } from '../../../Context/useUser';
import { MediaType } from '../../../Types/MediaType';

import {
  uploadMediaFiles,
  getMediaByCreator,
  deleteMediaFile,
} from '../../../services/ImagesService';
import type { Media } from '../../../Types/Creator';

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

export function ImagesTab() {
  const { user } = useUser();
  const creatorId = user?.id;

  const [profilePicture, setProfilePicture] = useState<Media | null>(null);
  const [coverPictures, setCoverPictures] = useState<Media[]>([]);
  const [otherPictures, setOtherPictures] = useState<Media[]>([]);

  useEffect(() => {
    if (!creatorId) return;
    (async () => {
      try {
        const media = await getMediaByCreator(creatorId);
        const filteredMedia = media.filter((m) => m.creatorId === creatorId);
        setProfilePicture(filteredMedia.find((m) => m.type === MediaType.PROFILE_PICTURE) || null);
        setCoverPictures(
          filteredMedia.filter((m) => m.type === MediaType.COVER_PICTURE).slice(0, 3),
        );
        setOtherPictures(filteredMedia.filter((m) => m.type === MediaType.OTHER));
      } catch (err) {
        console.error('Failed to fetch media:', err);
      }
    })();
  }, [creatorId]);

  const handleUpload = async (files: FileList, type: MediaType) => {
    if (!creatorId) return;
    try {
      const result = await uploadMediaFiles(creatorId, files, type);
      if (type === MediaType.PROFILE_PICTURE) setProfilePicture(result[0]);
      else if (type === MediaType.COVER_PICTURE)
        setCoverPictures((prev) => [...prev, ...result].slice(-3));
      else setOtherPictures((prev) => [...prev, ...result]);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleDelete = async (fileId: number) => {
    if (!creatorId) return;
    try {
      await deleteMediaFile(fileId);

      setOtherPictures((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <Box>
      {/* Profile Picture */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button component="label">
          <Avatar src={profilePicture?.url} sx={{ width: 80, height: 80 }} />
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleUpload(e.target.files, MediaType.PROFILE_PICTURE)
            }
          />
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 2,
        }}
      >
        {[
          ...coverPictures.map((c) => ({ ...c, isCover: true })),
          ...otherPictures.map((o) => ({ ...o, isCover: false })),
        ].map((file) => {
          const fullUrl = file.url;
          const isVideo = /\.(mp4|webm|ogg)$/i.test(fullUrl);

          return (
            <Box key={file.id} sx={{ position: 'relative', height: 250, width: '100%' }}>
              {!file.isCover && (
                <IconButton
                  size="small"
                  onClick={() => handleDelete(file.id)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    zIndex: 1,
                  }}
                >
                  <X size={14} />
                </IconButton>
              )}

              {file.isCover ? (
                <Button
                  component="label"
                  sx={{ width: '100%', height: '100%', p: 0, overflow: 'hidden' }}
                >
                  <img
                    src={fullUrl}
                    alt="Cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && handleUpload(e.target.files, MediaType.COVER_PICTURE)
                    }
                  />
                </Button>
              ) : isVideo ? (
                <video
                  controls
                  src={fullUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                />
              ) : (
                <img
                  src={fullUrl}
                  alt="Other"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                />
              )}
            </Box>
          );
        })}

        {/* Upload Placeholder */}
        <Box sx={{ height: 250, width: '100%' }}>
          <Button
            component="label"
            sx={{
              width: '100%',
              height: '100%',
              border: '1px dashed #ccc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              cursor: 'pointer',
            }}
          >
            <CloudUploadIcon size={48} />
            Click to upload
            <VisuallyHiddenInput
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => e.target.files && handleUpload(e.target.files, MediaType.OTHER)}
            />
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
