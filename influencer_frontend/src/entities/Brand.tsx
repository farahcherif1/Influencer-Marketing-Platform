import type { Category } from '../Types/Creator';
import type { SocialChannel } from './SocialChannel';

export interface Brand {
  id: number;
  name: string;
  username: string;
  brandName?: string | null;
  brandRole?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  coverPhotoUrl?: string | null;
  socialChannels?: SocialChannel[];
  industry?: string | null;
  targetPlatforms?: string[] | null;
  piecesOfContentPerMonth?: number | null;
  annualBudget?: number | null;
  location?: string | null;
  categories?: Category[] | null;
}

export type BrandDetails = {
  location: string;
  description: string;
  categories: Category[];
  logoUrl?: string;
  coverPhotoUrl?: string;
};
export type detailsTab = {
  location: string;
  description: string;
  categories: number[];
};

export type BrandUpdatePayload = {
  location: string;
  description: string;
  categoryIds: number[];
};

export type ReviewPayload = {
  creatorId: number;
  brandId: number;
  communicationRating: number;
  timeTakenToCompleteOrderRating: number;
  serviceRating: number;
  comment: string;
};
