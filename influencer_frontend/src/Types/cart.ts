import type { CartStatus } from './CartStatus';
import type { Creator, CreatorService } from './Creator';

export type CartItem = {
  id: string;
  creatorId: number;
  creator: Creator;
  creatorServiceId: number;
  cartId: number;
  creatorService: CreatorService;
};

export type Cart = {
  id: number;
  brandId: number;
  status: CartStatus;
  cartItems: CartItem[];
};

export type CartContextType = {
  cart: Cart | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: { creatorServiceId: number; cartId: number }) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
};
