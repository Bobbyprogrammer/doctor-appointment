"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, BadgeX } from "lucide-react";
import DataTable from "@/components/common/data-table";
import ConfirmDeleteDialog from "@/components/common/confirm-delete-dialog";
import { useServices } from "@/features/services/context/ServicesContext";
import type { Service } from "@/types/service";
import type { TableColumn } from "@/types/table";
import AddServiceDialog from "@/features/services/components/add-service-dialog";
import UpdateServiceDialog from "@/features/services/components/update-service-dialog";

export default function ServicesPage() {
  const { services, loading, deleteService } = useServices();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns: TableColumn<Service>[] = [
    {
      key: "name",
      title: "Service",
      render: (_, row) => (
        <div>
          <p className="font-medium text-white">{row.name}</p>
          <p className="text-xs text-slate-400">{row.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      title: "Category",
    },
    {
      key: "price",
      title: "Price",
      render: (value) => `$${Number(value || 0).toFixed(2)}`,
    },
    {
      key: "discountedPrice",
      title: "discounted Price",
      render: (value) => `$${Number(value || 0).toFixed(2)}`,
    },
    {
      key: "durationMinutes",
      title: "Duration",
      render: (value) => `${value} min`,
    },
    {
      key: "doctorType",
      title: "Doctor Type",
    },
    {
      key: "isActive",
      title: "Status",
      render: (value) =>
        value ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            <BadgeCheck className="h-3.5 w-3.5" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
            <BadgeX className="h-3.5 w-3.5" />
            Inactive
          </span>
        ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <UpdateServiceDialog service={row} />
          <ConfirmDeleteDialog
            title="Delete Service"
            description="Are you sure you want to delete this service?"
            onConfirm={() => deleteService(row._id || row.id || "")}
          />
        </div>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return services.slice(start, end);
  }, [services, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(services.length / rowsPerPage);

  return (
    <div className="w-full">
      <DataTable<Service>
        title="Services Directory"
        columns={columns}
        data={paginatedData}
        totalRecords={services.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        loading={loading}
        emptyMessage="No services found."
        headerAction={<AddServiceDialog />}
      />
    </div>
  );
}