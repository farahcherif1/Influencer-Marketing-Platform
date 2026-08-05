import api from '../api/axios';
import type { BookingItemPayload } from '../Types/api-response';
import type { Cart } from '../Types/cart';
import type { Brand, BrandUpdatePayload, ReviewPayload } from '../entities/Brand';
import { getCurrentUser } from './authService';

export const sendEmailInvite = async (email: string, userId: number): Promise<void> => {
  await api.post('/referral/invite', {
    email,
    userId,
  });
};

export const createReferral = async (referralCode: string, brandId: number) => {
  await api.post('/referral', { referralCode, brandId });
};

export const getBrandByUsername = async (username: string): Promise<Brand> => {
  const response = await api.get(`/brand/username/${username}`);
  return response.data;
};

// export const getCardByUserId = async (userId: number): Promise<Card | null> => {
//   const response = await api.get(`/card/userId/${userId}`);
//   return response.data;
// };

export const createBooking = async (cart: Cart, total: number) => {
  const res = await api.post('/booking', {
    brandId: cart?.brandId,
    price: total,
    status: 'pending',
  });
  return res.data.id;
};

export const createBookingItem = async (bookingId: number, payload: BookingItemPayload) => {
  try {
    const response = await api.post(`booking/${bookingId}/items`, payload);
    return response.data;
  } catch (err) {
    console.error('Failed to create booking item', err);
    throw err;
  }
};

export async function getBrandById(brandId: number) {
  const response = await api.get(`/brand/id/${brandId}`);
  return response.data;
}

export const getBrandBookingsByBrandId = async (brandId: number) => {
  const response = await api.get(`/brand/bookings/${brandId}`);
  return response.data;
};

export async function getDeliverablesByBookingItem(bookingItemId: number) {
  const res = await api.get(`/deliverable/${bookingItemId}`);
  return res.data;
}

export async function approveOrder(bookingItemId: number) {
  await api.post(`/deliverable/approved/${bookingItemId}`);
}

export async function createBrandReview(reviewData: ReviewPayload) {
  await api.post('/review-brand', reviewData);
}

export async function getBrandReviews(brandId: number) {
  const response = await api.get(`/review-brand/${brandId}`);
  return response.data;
}

export const updateBrandProfile = async (details: BrandUpdatePayload): Promise<void> => {
  const { data } = await api.put(`brand/me`, details);
  return data;
};
export const fetchBrandProfile = async (): Promise<Brand> => {
  const user = await getCurrentUser();
  const response = await api.get(`/brand/username/${user.username}`, { withCredentials: true });
  return response.data;
};
export const uploadBrandProfilePicture = async (brandId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.put(`/brand/${brandId}/profile-picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadBrandCoverPicture = async (brandId: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.put(`/brand/${brandId}/cover-picture`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export async function deleteBrandAccount() {
  const res = await api.delete('/brand/me');
  return res.data;
}
