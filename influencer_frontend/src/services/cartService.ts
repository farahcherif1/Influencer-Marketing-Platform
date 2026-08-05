import api from '../api/axios';

// Fetch the current user's cart
export const fetchCart = async () => {
  const response = await api.get('/cart/me');
  return response.data;
};

// Add an item to the cart
export const addItemToCart = async (item: { creatorServiceId: number; cartId: number }) => {
  await api.post('/cart-items', item);
  const updatedCart = await fetchCart();
  return updatedCart;
};

// Remove an item from the cart by its id
export const removeCartItem = async (itemId: string) => {
  const response = await api.delete(`/cart-items/${itemId}`);
  return response.data;
};
