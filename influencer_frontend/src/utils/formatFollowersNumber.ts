export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export const mapRangeToNumber = (range: string): number => {
  switch (range) {
    case '0-5':
      return 5;
    case '5-10':
      return 10;
    case '10-20':
      return 20;
    case '20-50':
      return 50;
    case '50+':
      return 60;
    default:
      return 0;
  }
};

export const mapBudgetToNumber = (budget: string): number => {
  switch (budget) {
    case '$1,000':
      return 1000;
    case '$1,000 - $5,000':
      return 5000;
    case '$5,000 - $10,000':
      return 10000;
    case '$10,000 - $50,000':
      return 50000;
    case '$50,000+':
      return 60000; // or any estimated upper value
    default:
      return 0;
  }
};

export const parseFollowers = (range: string): number => {
  const ranges: Record<string, number> = {
    '0–1k': 500,
    '1k–10k': 5000,
    '10k–50k': 30000,
    '50k–100k': 75000,
    '100k–500k': 300000,
    '500k–1m': 750000,
    '1m–5m': 2500000,
    '5m–10m': 7500000,
    '10m+': 10000000,
  };
  return ranges[range] ?? 0;
};

export const formatFollowerCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  }
  return count.toString();
};

const FOLLOWER_RANGES = [
  { label: '0-1k', min: 0, max: 1000 },
  { label: '1k-10k', min: 1000, max: 10000 },
  { label: '10k-50k', min: 10000, max: 50000 },
  { label: '50k-100k', min: 50000, max: 100000 },
  { label: '100k-500k', min: 100000, max: 500000 },
  { label: '500k-1m', min: 500000, max: 1000000 },
  { label: '1m-5m', min: 1000000, max: 5000000 },
  { label: '5m-10m', min: 5000000, max: 10000000 },
  { label: '10m+', min: 10000000, max: Infinity },
];

export const getFollowerRange = (followers: number) => {
  if (!followers || followers === 0) return '';

  const range = FOLLOWER_RANGES.find((r) => followers >= r.min && followers < r.max);
  return range ? range.label : '';
};
