import React, { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/formatters';

export const PickupMonitoringPage = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 0, totalPages: 1, totalElements: 0 });

  const fetchPickups = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await adminService.getAllPickups({ page, size: 10 });
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
    fetchPickups(0);
  }, [fetchPickups]);

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
      header: 'Volunteer Driver',
      render: (row) => (
        <div>
          <span className="font-semibold text-slate-800 block">
            {row.volunteerName || 'Unassigned'}
          </span>
          {row.volunteerPhone && <span className="text-[11px] text-slate-400">📞 {row.volunteerPhone}</span>}
        </div>
      ),
    },
    {
      header: 'Pickup Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Assigned Date',
      render: (row) => row.assignedAt ? formatDate(row.assignedAt) : 'Unassigned',
    },
    {
      header: 'Completion Date',
      render: (row) => row.completedAt ? formatDate(row.completedAt) : 'In Progress',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Logistics & Pickup Monitor</h1>
        <p className="text-xs text-slate-500">Live monitoring of all volunteer deliveries from food providers to NGOs</p>
      </div>

      <DataTable
        columns={columns}
        data={pickups}
        loading={loading}
        emptyMessage="No pickups registered in system."
        pagination={pagination}
        onPageChange={(p) => fetchPickups(p)}
      />
    </div>
  );
};
