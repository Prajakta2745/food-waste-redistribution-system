import React, { useState, useEffect, useCallback } from 'react';
import { ngoService } from '../../services/ngoService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const NgoRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  const fetchRequests = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await ngoService.getMyRequests({ page, size: 10 });
      if (res.success && res.data) {
        setRequests(res.data.content || []);
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
  }, []);

  useEffect(() => {
    fetchRequests(0);
  }, [fetchRequests]);

  const columns = [
    {
      header: 'Donation Item',
      accessor: 'foodName',
      render: (row) => <span className="font-bold text-slate-800">{row.foodName}</span>,
    },
    {
      header: 'Request Status',
      render: (row) => <StatusBadge status={row.requestStatus} />,
    },
    {
      header: 'Requested At',
      render: (row) => formatDate(row.requestedAt),
    },
    {
      header: 'Accepted At',
      render: (row) => row.acceptedAt ? formatDate(row.acceptedAt) : 'Pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">My Donation Claims & Requests</h1>
        <p className="text-xs text-slate-500">History of all surplus food batches requested by your organization</p>
      </div>

      <DataTable
        columns={columns}
        data={requests}
        loading={loading}
        emptyMessage="No donation claims logged yet."
        pagination={pagination}
        onPageChange={(p) => fetchRequests(p)}
      />
    </div>
  );
};
