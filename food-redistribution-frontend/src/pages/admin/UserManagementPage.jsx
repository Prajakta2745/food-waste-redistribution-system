import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });
  const [actionMsg, setActionMsg] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({
        role: roleFilter || undefined,
        page,
        size: 10,
      });
      if (res.success && res.data) {
        setUsers(res.data.content || []);
        setPagination({
          page: res.data.number,
          totalPages: res.data.totalPages,
          totalElements: res.data.totalElements,
        });
      }
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  }, [roleFilter]);

  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  const handleToggleStatus = async (userId, currentStatus) => {
    setActionMsg('');
    setError('');
    try {
      const res = await adminService.toggleUserStatus(userId, !currentStatus);
      if (res.success) {
        setActionMsg(`User status updated to ${!currentStatus ? 'ENABLED' : 'DISABLED'}`);
        fetchUsers(pagination.page);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const columns = [
    {
      header: 'User / Contact',
      accessor: 'name',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.name}</span>
          <span className="text-[11px] text-slate-400">{row.email}</span>
        </div>
      ),
    },
    {
      header: 'System Role',
      render: (row) => (
        <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {row.role}
        </span>
      ),
    },
    {
      header: 'Account Status',
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
            row.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}
        >
          {row.enabled ? 'ACTIVE' : 'DISABLED'}
        </span>
      ),
    },
    {
      header: 'Registered At',
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Actions',
      cellClassName: 'text-right',
      render: (row) => (
        <div>
          {row.role !== 'ADMIN' ? (
            <button
              onClick={() => handleToggleStatus(row.id, row.enabled)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                row.enabled
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {row.enabled ? 'Disable' : 'Enable'}
            </button>
          ) : (
            <span className="text-xs text-slate-400 italic">Protected</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">User Management</h1>
        <p className="text-xs text-slate-500">Manage all registered accounts across all 4 roles</p>
      </div>

      {actionMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
          {actionMsg}
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Role Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Users', value: '' },
          { label: 'Food Providers', value: 'FOOD_PROVIDER' },
          { label: 'NGOs', value: 'NGO' },
          { label: 'Volunteers', value: 'VOLUNTEER' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setRoleFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              roleFilter === tab.value
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="No users registered under this filter."
        pagination={pagination}
        onPageChange={(p) => fetchUsers(p)}
      />
    </div>
  );
};
