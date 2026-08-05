import BusinessIcon from '@mui/icons-material/Business';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LanguageIcon from '@mui/icons-material/Language';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

export const roleOptions = [
  { value: 'Founder-Executive', label: 'Founder / Executive' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales-Business Development', label: 'Sales / Business Development' },
  { value: 'CustomerSuccess-Support', label: 'Customer Success / Support' },
  { value: 'Product-Design', label: 'Product / Design' },
  { value: 'Engineering-Technical', label: 'Engineering / Technical' },
  { value: 'Operations-HR', label: 'Operations / HR' },
];

export const industryOptions = [
  { value: 'Agency', label: 'Agency', icon: <BusinessIcon /> },
  { value: 'E-commerce', label: 'E-commerce', icon: <ShoppingCartIcon /> },
  { value: 'Website/App', label: 'Website/App', icon: <LanguageIcon /> },
  { value: 'Brick & Mortar', label: 'Brick & Mortar', icon: <StorefrontIcon /> },
  { value: 'Other', label: 'Other', icon: <MoreHorizIcon /> },
];

export const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'ugc', label: 'User Generated Content' },
  { value: 'youtube', label: 'YouTube' },
];

export const contentPieceOptions = [
  { value: '0-5', label: '0-5' },
  { value: '5-10', label: '5-10' },
  { value: '10-20', label: '10-20' },
  { value: '20-50', label: '20-50' },
  { value: '50+', label: '50+' },
];

export const budgetOptions = [
  { value: '$1,000', label: 'Under $1,000' },
  { value: '$1,000 - $5,000', label: '$1,000 - $5,000' },
  { value: '$5,000 - $10,000', label: '$5,000 - $10,000' },
  { value: '$10,000 - $50,000', label: '$10,000 - $50,000' },
  { value: '$50,000+', label: '$50,000+' },
];
