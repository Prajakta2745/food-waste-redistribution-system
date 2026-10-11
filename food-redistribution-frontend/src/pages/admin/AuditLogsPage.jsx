import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  const fetchLogs = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs({
        entityType: entityFilter || undefined,
        page,
        size: 15,
      });
      if (res.success && res.data) {
        setLogs(res.data.content || []);
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
  }, [entityFilter]);

  useEffect(() => {
    fetchLogs(0);
  }, [fetchLogs]);

  const columns = [
    {
      header: 'Timestamp',
      render: (row) => <span className="font-mono text-[11px] text-slate-500">{formatDate(row.timestamp)}</span>,
    },
    {
      header: 'User Actor',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-800 block text-xs">{row.userName}</span>
          <span className="text-[10px] text-slate-400">{row.userEmail}</span>
        </div>
      ),
    },
    {
      header: 'Action',
      render: (row) => (
        <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Target Entity',
      render: (row) => `${row.entityType} #${row.entityId}`,
    },
    {
      header: 'Description',
      render: (row) => <span className="text-xs text-slate-600 leading-relaxed">{row.description}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Security & System Audit Trails</h1>
        <p className="text-xs text-slate-500">Immutable ledger recording all authentication, claims, and state transitions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: 'All Audits', value: '' },
          { label: 'Food Donations', value: 'FOOD_DONATION' },
          { label: 'Pickups', value: 'PICKUP' },
          { label: 'Users', value: 'USER' },
          { label: 'NGO Approvals', value: 'NGO_PROFILE' },
          { label: 'Volunteer Approvals', value: 'VOLUNTEER_PROFILE' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setEntityFilter(tab.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              entityFilter === tab.value
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
        data={logs}
        loading={loading}
        emptyMessage="No audit records available."
        pagination={pagination}
        onPageChange={(p) => fetchLogs(p)}
      />
    </div>
  );
};
