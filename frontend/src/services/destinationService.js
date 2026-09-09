import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const destinationService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get(ENDPOINTS.DESTINATIONS.BASE, { params });
    return response.data;
  },

  getTrending: async () => {
    const response = await apiClient.get(ENDPOINTS.DESTINATIONS.TRENDING);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.DESTINATIONS.BY_ID(id));
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.DESTINATIONS.BASE, data);
    return response.data;
  },
};
