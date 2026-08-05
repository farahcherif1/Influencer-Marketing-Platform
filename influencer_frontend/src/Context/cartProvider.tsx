import React, { useEffect, useState } from 'react';
import type { Cart } from '../Types/cart';
import * as cartService from '../services/cartService';
import { CartContext } from './CartContext';
import { useUser } from './useUser';

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useUser();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const loadCart = async () => {
    try {
      const data = await cartService.fetchCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const addToCart = async (item: { creatorServiceId: number; cartId: number }) => {
    try {
      const updatedCart = await cartService.addItemToCart(item);
      setCart(updatedCart);
      openCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartService.removeCartItem(itemId);
      if (cart) {
        setCart({
          ...cart,
          cartItems: cart.cartItems.filter((item) => item.id !== itemId),
        });
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const clearCart = async () => {
    try {
      if (cart) {
        for (const item of cart.cartItems) {
          await cartService.removeCartItem(item.id.toString());
        }
        setCart({ ...cart, cartItems: [] });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    if (user?.accessToken && user.profileComplete) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{ cart, isCartOpen, openCart, closeCart, addToCart, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
