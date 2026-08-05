import axios from 'axios';
import api from '../api/axios';
import i18n from '../i18n';

type GeoapifyFeature = {
  properties: {
    formatted: string;
  };
};

export async function fetchCities(query: string): Promise<string[]> {
  if (!query) return [];

  let lang = i18n.language;
  if (lang.includes('-')) {
    lang = lang.split('-')[0];
  }

  try {
    const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
      params: {
        text: query,
        type: 'city',
        lang: lang,
        apiKey: import.meta.env.VITE_GEOAPIFY_KEY,
        limit: 10,
      },
      withCredentials: false,
    });

    return (response.data.features as GeoapifyFeature[]).map((f) => f.properties.formatted);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

export const updateBrandStep = async (brandId: number, data: Record<string, unknown>) => {
  try {
    await api.post(`/brand/${brandId}/step`, data);
  } catch (error) {
    console.error('Error updating brand step:', error);
    throw error;
  }
};

export const setTokenAfterSignup = async (userId: number) => {
  const response = await api.post('/auth/token-after-signup', { userId });
  return response.data;
};
export const createUsername = async (creatorId: number, username: string) =>
  api.post(`/creator/${creatorId}/username`, { username });

export const createLocation = async (creatorId: number, location: string) =>
  api.post(`/creator/${creatorId}/location`, { location });

export const createTitle = async (creatorId: number, title: string) =>
  api.post(`/creator/${creatorId}/title`, { title });

export const createDescription = async (creatorId: number, description: string) =>
  api.post(`/creator/${creatorId}/description`, { description });

export const createGender = async (creatorId: number, gender: string) =>
  api.post(`/creator/${creatorId}/gender`, { gender });

export const createSocialChannel = async (
  creatorId: number,
  data: {
    platform: string;
    username?: string;
    followers?: number;
    url?: string;
  },
) => api.post(`/creator/${creatorId}/social-channel`, data);

export const createContentTypes = async (creatorId: number, contentTypes: string[]) =>
  api.post(`/creator/${creatorId}/categories`, { contentTypes });
export const createCategories = async (creatorId: number, categoryIds: number[]) =>
  api.post(`/creator/${creatorId}/categories`, { categoryIds });

export const createMedia = async (creatorId: number, formdata: FormData) =>
  api.post(`/creator/${creatorId}/media`, formdata);

export const createPhoneNumber = async (creatorId: number, phoneNumber: string) =>
  api.post(`/creator/${creatorId}/phone-number`, { phoneNumber });

export const createCreatorService = async (
  creatorId: number,
  serviceData: {
    serviceId: number;
    quantity: number;
    duration?: number;
    durationUnit?: string;
    price: number;
    description: string;
  },
) => {
  return api.post(`/creator-service/${creatorId}`, serviceData);
};
