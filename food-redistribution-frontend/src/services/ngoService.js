import api from './api';

export const ngoService = {
  getDashboardStats: async () => {
    const response = await api.get('/ngo/dashboard');
    return response.data;
  },

  searchAvailableDonations: async (params = {}) => {
    const response = await api.get('/ngo/donations/available', { params });
    return response.data;
  },

  getDonationDetails: async (id) => {
    const response = await api.get(`/ngo/donations/${id}`);
    return response.data;
  },

  claimDonation: async (id) => {
    const response = await api.post(`/ngo/donations/${id}/request`);
    return response.data;
  },

  getMyRequests: async (params = {}) => {
    const response = await api.get('/ngo/requests', { params });
    return response.data;
  },

  getMyPickups: async (params = {}) => {
    const response = await api.get('/ngo/pickups', { params });
    return response.data;
  },

  getAvailableVolunteers: async () => {
    const response = await api.get('/ngo/volunteers/available');
    return response.data;
  },

  assignVolunteer: async (pickupId, assignmentData) => {
    const response = await api.post(`/ngo/pickups/${pickupId}/assign-volunteer`, assignmentData);
    return response.data;
  },

  confirmFoodReceived: async (pickupId) => {
    const response = await api.put(`/ngo/pickups/${pickupId}/confirm-receipt`);
    return response.data;
  },
};
