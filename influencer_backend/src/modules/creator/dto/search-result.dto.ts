export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SearchCreatorResult {
  id?: number;
  imageUrls?: string | null;
  name?: string;
  username?: string;
  age?: number | null;
  gender?: string | null;
  email?: string;
  title?: string | null;
  city?: string | null;
  country?: string | null;
  rating?: number;
  isVerified?: boolean;
  referral?: string | null;
  profileComplete?: boolean;
  prices?: {
    price: number;
    platform: string | null;
    contentType: string | null;
  }[];
  description?: string | null;
  location?: string;
  followers?: {
    platform: string;
    followers: number;
  }[];
}
