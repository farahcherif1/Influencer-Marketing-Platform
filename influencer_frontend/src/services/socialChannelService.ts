import api from '../api/axios';
import type { CreateSocialChannelDto, SocialChannel } from '../Types/Creator';

const BASE_URL = '/social-channel';

export const getSocialChannels = async (
  userId: string,
  role: 'creator' | 'brand',
): Promise<SocialChannel[]> => {
  const endpoint = role === 'creator' ? 'creator' : 'brand';
  const response = await api.get(`${BASE_URL}/${endpoint}/${userId}`);
  return response.data;
};

export const updateSocialChannel = async (
  id: number,
  payload: Partial<SocialChannel>,
): Promise<SocialChannel> => {
  const response = await api.put(`${BASE_URL}/${id}`, payload);
  return response.data;
};

export const deleteSocialChannel = async (id: number): Promise<void> => {
  await api.delete(`${BASE_URL}/${id}`);
};
export const createSocialChannel = async (
  userId: number,
  dto: CreateSocialChannelDto,
  role: 'creator' | 'brand',
): Promise<SocialChannel> => {
  const { data } = await api.post(`${BASE_URL}/user/${userId}?role=${role}`, dto);
  return data;
};
