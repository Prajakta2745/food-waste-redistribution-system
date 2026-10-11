import api from './api';

export const volunteerService = {
  getDashboardStats: async () => {
    const response = await api.get('/volunteer/dashboard');
    return response.data;
  },

  getMyPickups: async (params = {}) => {
    const response = await api.get('/volunteer/pickups', { params });
    return response.data;
  },

  getPickupDetails: async (id) => {
    const response = await api.get(`/volunteer/pickups/${id}`);
    return response.data;
  },

  acceptPickup: async (id) => {
    const response = await api.put(`/volunteer/pickups/${id}/accept`);
    return response.data;
  },

  rejectPickup: async (id, reason) => {
    const response = await api.put(`/volunteer/pickups/${id}/reject`, null, {
      params: { reason },
    });
    return response.data;
  },

  updatePickupStatus: async (id, statusData) => {
    const response = await api.put(`/volunteer/pickups/${id}/status`, statusData);
    return response.data;
  },

  updateAvailability: async (availability) => {
    const response = await api.put('/volunteer/availability', null, {
      params: { availability },
    });
    return response.data;
  },
};
