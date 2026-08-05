import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import TikTokIcon from '@mui/icons-material/MusicNote';
import TwitchIcon from '@mui/icons-material/SportsEsports';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LanguageIcon from '@mui/icons-material/Language';

export const GenderOptions = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
];

export const channels = [
  { key: 'Instagram', icon: <InstagramIcon />, hasFollowers: true },
  { key: 'TikTok', icon: <TikTokIcon />, hasFollowers: true },
  { key: 'YouTube', icon: <YouTubeIcon />, hasFollowers: true },
  { key: 'Twitter', icon: <TwitterIcon />, hasFollowers: true },
  { key: 'Twitch', icon: <TwitchIcon />, hasFollowers: true },
  { key: 'Amazon', icon: <StorefrontIcon />, hasFollowers: false },
  { key: 'Website', icon: <LanguageIcon />, hasFollowers: false },
];

export const followerRanges = [
  { value: '0–1k', label: '0–1k' },
  { value: '1k–10k', label: '1k–10k' },
  { value: '10k–50k', label: '10k–50k' },
  { value: '50k–100k', label: '50k–100k' },
  { value: '100k–500k', label: '100k–500k' },
  { value: '500k–1m', label: '500k–1m' },
  { value: '1m–5m', label: '1m–5m' },
  { value: '5m–10m', label: '5m–10m' },
  { value: '10m+', label: '10m+' },
];

export const categories = [
  { label: 'Lifestyle', value: 'lifestyle' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Beauty', value: 'beauty' },
  { label: 'Travel', value: 'travel' },
  { label: 'Health & Fitness', value: 'health-fitness' },
  { label: 'Food & Drink', value: 'food-drink' },
  { label: 'Comedy & Entertainment', value: 'comedy-entertainment' },
  { label: 'Art & Photography', value: 'art-photography' },
  { label: 'Model', value: 'model' },
  { label: 'Music & Dance', value: 'music-dance' },
  { label: 'Family & Children', value: 'family-children' },
  { label: 'Entrepreneur & Business', value: 'entrepreneur-business' },
  { label: 'Animals & Pets', value: 'animals-pets' },
  { label: 'Education', value: 'education' },
  { label: 'Adventure & Outdoors', value: 'adventure-outdoors' },
  { label: 'Athlete & Sports', value: 'athlete-sports' },
  { label: 'Technology', value: 'technology' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Celebrity & Public Figure', value: 'celebrity-public-figure' },
  { label: 'Actor', value: 'actor' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'LGBTQ2+', value: 'lgbtq2' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'Automotive', value: 'automotive' },
  { label: 'Skilled Trades', value: 'skilled-trades' },
  { label: 'E-commerce', value: 'ecommerce' },
];

export const contentTypesOptions = [
  { label: 'UGC Product Video', value: 'ugc-product-video' },
  { label: 'UGC Product Photo', value: 'ugc-product-photo' },
  { label: 'UGC Video Ad', value: 'ugc-video-ad' },
  { label: 'UGC Photo Ad', value: 'ugc-photo-ad' },
  { label: 'UGC tutorial', value: 'ugc-tutorial' },
  { label: 'UGC Testimonial/Review', value: 'ugc-testimonial-review' },
  { label: 'UGC unboxing', value: 'ugc-unboxing' },
  { label: 'UGC Blog', value: 'ugc-blog' },
  { value: '0–1k' },
  { value: '1k–10k' },
  { value: '10k–50k' },
  { value: '50k–100k' },
  { value: '100k–500k' },
  { value: '500k–1m' },
  { value: '1m–5m' },
  { value: '5m–10m' },
  { value: '10m+' },
];

export const durationUnits = [
  { label: 'Seconds', value: 'second' },
  { label: 'Minutes', value: 'minute' },
  { label: 'Hours', value: 'hour' },
];
