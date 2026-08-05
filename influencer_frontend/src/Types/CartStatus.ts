export const CartStatus = {
  ACTIVE: 'active',
  CHECKED_OUT: 'checkedOut',
  ABANDONED: 'abandoned',
  COMPLETED: 'completed',
} as const;

export type CartStatus = (typeof CartStatus)[keyof typeof CartStatus];
