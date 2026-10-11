import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  toggleUserStatus: async (userId, enabled) => {
    const response = await api.put(`/admin/users/${userId}/status`, null, {
      params: { enabled },
    });
    return response.data;
  },

  getPendingNgos: async (params = {}) => {
    const response = await api.get('/admin/ngos/pending', { params });
    return response.data;
  },

  verifyNgo: async (ngoId, verificationData) => {
    const response = await api.put(`/admin/ngos/${ngoId}/verify`, verificationData);
    return response.data;
  },

  getPendingVolunteers: async (params = {}) => {
    const response = await api.get('/admin/volunteers/pending', { params });
    return response.data;
  },

  verifyVolunteer: async (volunteerId, verificationData) => {
    const response = await api.put(`/admin/volunteers/${volunteerId}/verify`, verificationData);
    return response.data;
  },

  getAllDonations: async (params = {}) => {
    const response = await api.get('/admin/donations', { params });
    return response.data;
  },

  getAllPickups: async (params = {}) => {
    const response = await api.get('/admin/pickups', { params });
    return response.data;
  },

  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },
};
