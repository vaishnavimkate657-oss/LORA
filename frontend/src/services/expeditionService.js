import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const expeditionService = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.EXPEDITIONS.BASE);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.EXPEDITIONS.BY_ID(id));
    return response.data;
  },

  join: async (data) => {
    const response = await apiClient.post(ENDPOINTS.EXPEDITIONS.JOIN, data);
    return response.data;
  },
};
