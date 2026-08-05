import { SocialChannel } from '../../social-channel/entities/social-channel.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Wallet } from '../../../modules/wallet/entities/wallet.entity';
import { Billing } from '../../billing/entities/billing.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { ReviewBrand } from '../../review-brand/entities/review-brand.entity';
import { ReviewCreator } from '../../review-creator/entities/review-creator.entity';
import { Category } from 'modules/category/category.entity';

export interface BrandDto {
  id: number;
  username: string;
  email: string;
  brandName?: string;
  brandRole?: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  description?: string;
  industry?: string;
  targetPlatforms?: string[];
  piecesOfContentPerMonth?: number;
  annualBudget?: number;
  location?: string;

  // Relations
  categories?: Category[];
  socialChannels?: SocialChannel[];
  cart?: Cart;
  wallet?: Wallet;
  billing?: Billing;
  bookings?: Booking[];
  writtenCreatorReviews?: ReviewCreator[];
  receivedReviews?: ReviewBrand[];
}
