export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '/api';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  DESTINATIONS: {
    BASE: '/destinations',
    TRENDING: '/destinations/trending',
    BY_ID: (id) => `/destinations/${id}`,
  },
  PARTNERS: {
    BASE: '/partners',
    BY_ID: (id) => `/partners/${id}`,
    CONNECT: '/partners/connect',
  },
  TRIPS: {
    BASE: '/trips',
    MY_TRIPS: '/trips/my-trips',
    BY_ID: (id) => `/trips/${id}`,
    ITINERARY: (tripId) => `/trips/${tripId}/itinerary`,
    EXPENSES: (tripId) => `/trips/${tripId}/expenses`,
  },
  EXPEDITIONS: {
    BASE: '/expeditions',
    BY_ID: (id) => `/expeditions/${id}`,
    JOIN: '/expeditions/join',
  },
};
