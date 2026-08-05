import type { Brand } from '../entities/Brand';
import type { MediaType } from './MediaType';

// Social
export type SocialChannel = {
  id?: number;
  platform: string;
  url?: string;
  username?: string;
  followers?: number;
  creatorId?: number;
  brandId?: number;
};
export type Niche = {
  id: number;
  name: string;
};
export type CreatorDetails = {
  name: string | null;
  location: string | null;
  title: string | null;
  description: string | null;
  gender: string | null;
};
export type CreatorSettings = {
  email: string;
  password: string;
  //cardNumber: string;
};
// Portfolio
export type PortfolioItem = {
  id: number;
  url: string;
};

// Media
export type Media = {
  id: number;
  creatorId: number;
  url: string;
  type: MediaType;
};

// Services
export type CreatorService = {
  id: number;
  description?: string;
  price: number;
  quantity: number;
  duration: number;
  durationUnit?: 'minutes' | 'hours' | 'seconds';
  creatorId: number;
  serviceId: number;
  service: Service;
  creator: Creator;
};

export type PackageData = {
  id: number;
  quantity: string;
  duration?: string;
  durationUnit?: 'minutes' | 'hours' | 'seconds' | '';
  price: string;
  description?: string;
  serviceId?: number;
  contentType: string;
  _modified?: boolean;
};

export type CreatePackage = {
  id: number;
  serviceId: number | '';
  quantity: string;
  duration: string;
  durationUnit: string;
  price: string;
  description: string;
  showDescription: boolean;
};

export type Service = {
  id: number;
  name: string;
  platform: 'Instagram' | 'UGC' | 'Tiktok' | 'YouTube' | 'Twitter' | 'Twitch';
  hasDuration: boolean;
};
export type PackageItem = {
  id: string;
  title: string;
  price: string;
  description?: string;
  selected?: boolean;
  platform: 'Instagram' | 'UGC' | 'Tiktok' | 'YouTube' | 'Twitter' | 'Twitch';
};
// Reviews
export type ReviewCreator = {
  id: number;
  rating: number;
  comment: string;
};

export type ReviewBrand = {
  id: number;
  rating: number;
  comment: string;
};
export type Wallet = {
  id: number;
  balance: number;
};

// User Info
export type User = {
  id: number;
  name: string;
  username?: string;
  email: string;
  accessToken: string;
  referralCode: string;
  role: 'brand' | 'creator';
  logoUrl?: string | null;
  profileComplete: boolean;
  isVerified: boolean;
};

export type Creator = {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  role: string;
  gender: 'Male' | 'Female' | 'Other';
  isVerified: boolean;
  referralCode: string;
  categories: Category[];
  location: string | null;
  city: string | null;
  country: string | null;
  title: string | null;
  description: string | null;
  starRating: number;
  phoneNumber: string | null;
  socialChannels: SocialChannel[];
  niches: Niche[];
  portfolio: PortfolioItem[];
  media: Media[];
  creatorServices: CreatorService[];
  receivedReviews: ReviewCreator[];
  writtenBrandReviews: ReviewBrand[];
  wallet: Wallet | null;
  card: null;
  // Optionally add:
  isTopCreator?: boolean;
  respondsFast?: boolean;
};

export interface CountryEntry {
  name: string;
  dial_code: string;
  code: string;
}

export type Category = {
  id: number;
  name: string;
  label: string;
};

export type UpdateAccountResponse = {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
  };
};

export interface firstStepProps {
  userId: number;
  onContinue: () => void;
}

export interface mediumStepProps {
  userId: number;
  onContinue: () => void;
  onBack: () => void;
}

export type GeoapifyFeature = { properties: { formatted: string } };

export type UserRole = { role: 'creator' | 'brand' };

export interface SearchBarProps {
  initialPlatform?: string;
  initialCategory?: string;
}

export type CreatorSearchData = {
  platform?: string;
  category?: string;

  country?: string;
  city?: string;

  ageMin?: number;
  ageMax?: number;

  priceMin?: number;
  priceMax?: number;

  gender?: 'Male' | 'Female' | 'Other';

  ethnicity?: string;
  contentType?: string;

  followersMin?: number;
  followersMax?: number;

  keyword?: string;

  page: number;

  limit: number;
};
export interface Price {
  price: number;
  platform: string;
  contentType: string;
}
export interface Followers {
  platform: string;
  followers: number;
}

export type CreatorSearchResponse = {
  id: number | string;
  imageUrls: string;
  name: string;
  username: string;
  rating: number;
  prices: Price[];
  title: string;
  location: string;
  followers: Followers[];
};

export type CreateSocialChannelDto = {
  platform: string;
  url: string;
  followers: number;
  username?: string;
};

export type BookingItem = {
  id: number;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  unitPrice: number;
  creatorService: CreatorService;
  productDescription: string;
  contentRequirements: string;
  contentApproval: boolean;
  physicalProduct: boolean;
  productCost: number;
  useForAds: boolean;
  additionalRequirements: string;
  deliveryDate: string;
  status: 'Requested' | 'In Progress' | 'Completed' | 'Declined';
  booking: Booking;
};

export type Booking = {
  id: number;
  createdAt: string;
  brandId: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingItems: BookingItem[];
};

export type Deliverable = {
  id: number;
  bookingItemId: number;
  files?: { fileName: string; url: string }[] | null;
  links?: string[] | null;
  approved?: boolean;
  bookingItem: BookingItem;
};

export type Review = {
  id: number;
  communicationRating: number;
  timeTakenToCompleteOrderRating: number;
  serviceRating: number;
  comment: string;
  createdAt: string;
  creator: Creator;
  brand: Brand;
};
