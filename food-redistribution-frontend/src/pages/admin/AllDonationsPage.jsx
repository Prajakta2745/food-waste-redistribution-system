import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const AllDonationsPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  const fetchAll = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getAllDonations({ page, size: 10 });
      if (res.success && res.data) {
        setDonations(res.data.content || []);
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
    fetchAll(0);
  }, [fetchAll]);

  const columns = [
    {
      header: 'Donation Title',
      accessor: 'foodName',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.foodName}</span>
          <span className="text-[11px] text-slate-400">
            {row.foodCategory?.replace(/_/g, ' ')} • {row.foodType?.replace(/_/g, ' ')}
          </span>
        </div>
      ),
    },
    {
      header: 'Provider',
      accessor: 'providerOrganizationName',
      render: (row) => <span className="font-semibold text-slate-800">{row.providerOrganizationName}</span>,
    },
    {
      header: 'Quantity',
      render: (row) => `${row.quantity} ${row.quantityUnit}`,
    },
    {
      header: 'City / State',
      render: (row) => `${row.city}, ${row.state}`,
    },
    {
      header: 'Lifecycle Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Posted Date',
      render: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">All System Food Donations</h1>
        <p className="text-xs text-slate-500">Global audit of all surplus food batches submitted across the platform</p>
      </div>

      <DataTable
        columns={columns}
        data={donations}
        loading={loading}
        emptyMessage="No donations found in database."
        pagination={pagination}
        onPageChange={(p) => fetchAll(p)}
      />
    </div>
  );
};
