import React, { useState, useEffect, useCallback } from 'react';
import { volunteerService } from '../../services/volunteerService';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { formatDate } from '../../utils/formatters';

export const DeliveryHistoryPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  const fetchHistory = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await volunteerService.getMyPickups({ page, size: 10 });
      if (res.success && res.data) {
        setPickups(res.data.content || []);
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
    fetchHistory(0);
  }, [fetchHistory]);

  const columns = [
    {
      header: 'Donation Item',
      accessor: 'foodName',
      render: (row) => <span className="font-bold text-slate-800">{row.foodName}</span>,
    },
    {
      header: 'Destination NGO',
      accessor: 'ngoName',
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Delivered Timestamp',
      render: (row) => row.deliveredAt ? formatDate(row.deliveredAt) : 'Pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Delivery History</h1>
        <p className="text-xs text-slate-500">Record of all food rescue runs completed by you</p>
      </div>

      <DataTable
        columns={columns}
        data={pickups}
        loading={loading}
        emptyMessage="No delivery records found."
        pagination={pagination}
        onPageChange={(p) => fetchHistory(p)}
      />
    </div>
  );
};
