import type { Media } from '../Types/Creator';
import type { MediaType } from '../Types/MediaType';

export async function uploadMediaFiles(
  creatorId: number,
  files: FileList,
  type: MediaType,
): Promise<Media[]> {
  const formData = new FormData();
  for (const file of Array.from(files)) {
    formData.append('files', file);
  }
  formData.append('type', type.toString());

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/media/${creatorId}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload files');
  }

  return await res.json();
}
export async function getMediaByCreator(creatorId: number): Promise<Media[]> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/media?creatorId=${creatorId}`);
  if (!res.ok) {
    throw new Error('Failed to fetch media');
  }
  return res.json();
}

export async function deleteMediaFile(fileId: number) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/media/${fileId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete media file');
  }
  return res.json();
}
