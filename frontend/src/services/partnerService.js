import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const partnerService = {
  getAll: async (params = {}) => {
    const response = await apiClient.get(ENDPOINTS.PARTNERS.BASE, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.PARTNERS.BY_ID(id));
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.PARTNERS.BASE, data);
    return response.data;
  },

  sendConnectionRequest: async (data) => {
    const response = await apiClient.post(ENDPOINTS.PARTNERS.CONNECT, data);
    return response.data;
  },
};
