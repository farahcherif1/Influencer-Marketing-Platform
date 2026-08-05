import type { PortfolioItem } from '../Types/Creator';

export async function uploadPortfolioFiles(
  creatorId: number,
  files: FileList,
): Promise<PortfolioItem[]> {
  const formData = new FormData();
  for (const file of Array.from(files)) {
    formData.append('files', file);
  }

  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/creators/${creatorId}/portfolio`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload files');
  }

  return await res.json();
}
export async function getPortfolioFiles(creatorId: number): Promise<PortfolioItem[]> {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/creators/${creatorId}/portfolio`);
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return await res.json();
}

export async function deletePortfolioFile(creatorId: number, fileId: number): Promise<void> {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/creators/${creatorId}/portfolio/${fileId}`,
    { method: 'DELETE' },
  );
  if (!res.ok) throw new Error('Failed to delete portfolio file');
}
