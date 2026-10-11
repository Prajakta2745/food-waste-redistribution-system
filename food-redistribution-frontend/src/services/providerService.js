import api from './api';

export const providerService = {
  getDashboardStats: async () => {
    const response = await api.get('/provider/dashboard');
    return response.data;
  },

  createDonation: async (donationData) => {
    const response = await api.post('/provider/donations', donationData);
    return response.data;
  },

  getMyDonations: async (params = {}) => {
    const response = await api.get('/provider/donations', { params });
    return response.data;
  },

  getDonationDetails: async (id) => {
    const response = await api.get(`/provider/donations/${id}`);
    return response.data;
  },

  updateDonation: async (id, donationData) => {
    const response = await api.put(`/provider/donations/${id}`, donationData);
    return response.data;
  },

  cancelDonation: async (id, reason) => {
    const response = await api.put(`/provider/donations/${id}/cancel`, null, {
      params: { reason },
    });
    return response.data;
  },
};
