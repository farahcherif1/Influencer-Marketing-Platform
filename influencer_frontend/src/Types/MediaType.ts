export const MediaType = {
  PROFILE_PICTURE: 'PROFILE_PICTURE',
  COVER_PICTURE: 'COVER_PICTURE',
  OTHER: 'OTHER',
} as const;

export type MediaType = (typeof MediaType)[keyof typeof MediaType];
