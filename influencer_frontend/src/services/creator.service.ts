import axios from 'axios';
import api from '../api/axios';
import type {
  CreatorSettings,
  CreatorDetails,
  Creator,
  UpdateAccountResponse,
  Service,
  PackageData,
  BookingItem,
  CreatorSearchData,
} from '../Types/Creator';
import { getCurrentUser } from './authService';
import type {
  DeletePackageResponse,
  LogoutResponse,
  UpdateCreatorProfileResponse,
} from '../Types/api-response';
import type { ReviewPayload } from '../entities/Brand';

axios.defaults.withCredentials = true;

export const fetchCreatorProfile = async (): Promise<Creator> => {
  const user = await getCurrentUser();
  const response = await api.get(`/creator/username/${user.username}`, { withCredentials: true });
  return response.data;
};

export const updateCreatorProfile = async (
  formData: CreatorDetails,
): Promise<UpdateCreatorProfileResponse> => {
  const res = await api.put('/creator/me', formData, { withCredentials: true });
  return res.data;
};

export const getCreatorByUsername = async (username: string): Promise<Creator> => {
  const response = await api.get(`/creator/username/${username}`);
  return response.data;
};

export const updateAccount = async (formData: CreatorSettings): Promise<UpdateAccountResponse> => {
  const res = await api.put('/creator/account', formData, { withCredentials: true });
  return res.data;
};

export const verify = async (currentPassword: string): Promise<boolean> => {
  const response = await api.post(
    '/creator/verifyCurrentPassword',
    { password: currentPassword },
    { withCredentials: true },
  );

  return response.data === true;
};

export const fetchCreatorPackage = async (): Promise<PackageData[]> => {
  const response = await api.get(`/creator-service/packages`, { withCredentials: true });

  if (response.status !== 200) {
    throw new Error('Failed to fetch creator packages');
  }
  return response.data;
};

export const getServiceId = async (name: string): Promise<number> => {
  const response = await api.get('/services/serviceIdByName', {
    params: { serviceName: name },
    withCredentials: true,
  });
  const id: number = response.data;
  return id;
};

export const getServicesWithDuration = async (): Promise<[number]> => {
  const response = await api.get('/services/servicesWithDuration', {
    withCredentials: true,
  });
  return response.data;
};

export const addCreatorPackage = async (packageData: PackageData): Promise<PackageData> => {
  const servId = await getServiceId(packageData.contentType);
  const { id, ...rest } = packageData;
  const res = await api.post(
    `/creator/addPackage`,
    {
      ...rest,
      serviceId: servId,
    },
    { withCredentials: true },
  );
  console.error('current package id ', id);

  return {
    ...res.data,
    contentType: packageData.contentType,
  };
};

export const updateCreatorPackage = async (id: number, updates: PackageData) => {
  const res = await api.put(`/creator-service/update/${id}}`, updates, { withCredentials: true });
  return await res.data;
};

export const removePackage = async (id: number): Promise<DeletePackageResponse> => {
  const response = await api.delete(`/creator-service/removePackage/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const fetchServices = async (): Promise<[]> => {
  const res = await api.get('/services/all', { withCredentials: true });
  return res.data;
};
export const signOut = async (): Promise<LogoutResponse> => {
  return await api.post(`/auth/logout`, {
    withCredentials: true,
  });
};
export const getServices = async (): Promise<Service[]> => {
  const res = await api.get('/services');
  return res.data;
};

export const getPLatforms = async (): Promise<string[]> => {
  const res = await api.get('/services/platforms');
  return res.data;
};

export async function getSocialChannelsByCreatorId(creatorId: number) {
  const res = await api.get(`/social-channel/creator/${creatorId}`);
  return res.data;
}

export async function fetchCategories() {
  const response = await api.get('/categories');
  return response.data;
}

export async function getCreatorById(creatorId: number) {
  const response = await api.get(`/creator/id/${creatorId}`);
  return response.data;
}

export async function getServiceIdById(serviceId: number): Promise<Service> {
  const response = await api.get(`/services/serviceId/${serviceId}`);
  return response.data;
}

export async function getCreatorBookingsByCreatorId(creatorId: number) {
  const response = await api.get(`/creator/bookings/${creatorId}`);
  return response.data;
}

export async function updateOrderStatus(orderId: number, status: string): Promise<BookingItem> {
  const response = await api.put(`/booking-item/${orderId}/status`, { status });
  return response.data;
}

export async function uploadFiles(bookingItemId: number, files: File[]) {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const res = await api.post(`/deliverable/upload/${bookingItemId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
}

export async function uploadLinks(bookingItemId: number, links: string[]) {
  const res = await api.post(`/deliverable/links/${bookingItemId}`, { links });
  return res.data;
}

export async function createCreatorReview(reviewData: ReviewPayload) {
  await api.post('/review-creator', reviewData);
}

export async function getCreatorReviews(creatorId: number) {
  const response = await api.get(`/review-creator/${creatorId}`);
  return response.data;
}

export async function fetchCreators(searchData: CreatorSearchData) {
  const res = await api.get('/creator/search', { params: searchData });
  return res.data;
}

export async function deleteCreatorAccount() {
  const res = await api.delete('/creator/me');
  return res.data;
}
