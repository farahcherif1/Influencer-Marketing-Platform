import axios from 'axios';
import type { GeoapifyFeature } from '../Types/Creator';

const GEOAPIFY_API_KEY = '2c4b59efe1ea4c14976ff238f596df65';

export const fetchLocationSuggestions = async (query: string): Promise<string[]> => {
  if (!query) return [];

  try {
    const response = await axios.get('https://api.geoapify.com/v1/geocode/autocomplete', {
      params: {
        text: query,
        apiKey: GEOAPIFY_API_KEY,
        limit: 5,
      },
      withCredentials: false,
    });

    return response.data.features.map((item: GeoapifyFeature) => item.properties.formatted);
  } catch (error) {
    console.error('Geoapify fetch error:', error);
    return [];
  }
};
