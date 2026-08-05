import { createContext } from 'react';

import type { CartContextType } from '../Types/cart';

export const CartContext = createContext<CartContextType | undefined>(undefined);
