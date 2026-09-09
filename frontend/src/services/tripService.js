import apiClient from './apiClient';
import { ENDPOINTS } from '../constants/apiEndpoints';

export const tripService = {
  getAll: async () => {
    const response = await apiClient.get(ENDPOINTS.TRIPS.BASE);
    return response.data;
  },

  getMyTrips: async () => {
    const response = await apiClient.get(ENDPOINTS.TRIPS.MY_TRIPS);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(ENDPOINTS.TRIPS.BY_ID(id));
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.TRIPS.BASE, data);
    return response.data;
  },

  addItineraryItem: async (tripId, data) => {
    const response = await apiClient.post(ENDPOINTS.TRIPS.ITINERARY(tripId), data);
    return response.data;
  },

  addTripExpense: async (tripId, data) => {
    const response = await apiClient.post(ENDPOINTS.TRIPS.EXPENSES(tripId), data);
    return response.data;
  },

  getTripExpenses: async (tripId) => {
    const response = await apiClient.get(ENDPOINTS.TRIPS.EXPENSES(tripId));
    return response.data;
  },
};
