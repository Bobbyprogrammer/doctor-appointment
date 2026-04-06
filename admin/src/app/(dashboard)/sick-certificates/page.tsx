"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/common/data-table";
import type { TableColumn } from "@/types/table";
import type { SickCertificateRequest } from "@/types/sick-certificate";
import { AdminSickCertificatesProvider, useAdminSickCertificates } from "@/features/sick/context/AdminSickCertificatesContext";
import SickCertificateStatusBadge from "@/features/sick/components/sick-certificate-status-badge";
import SickCertificatePaymentBadge from "@/features/sick/components/sick-certificate-payment-badge";
import AdminSickCertificateDetailsDialog from "@/features/sick/components/admin-sick-certificate-details-dialog";

const currency = process.env.NEXT_PUBLIC_CURRENCY || "€";

function AdminSickCertificatesPageContent() {
  const { requests, loading } = useAdminSickCertificates();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns: TableColumn<SickCertificateRequest>[] = [
    {
      key: "reference",
      title: "Reference",
      render: (value) => (
        <span className="font-medium text-white">{String(value || "-")}</span>
      ),
    },
    {
      key: "patientId",
      title: "Patient",
      render: (_, row) => {
        const patient =
          typeof row.patientId === "object" ? row.patientId : null;

        return (
          <div>
            <p className="font-medium text-white">
              {patient
                ? `${patient.firstName} ${patient.lastName}`
                : row.fullName || "N/A"}
            </p>
            <p className="text-xs text-slate-400">
              {patient?.email || row.email || ""}
            </p>
          </div>
        );
      },
    },
    {
      key: "doctorId",
      title: "Doctor",
      render: (_, row) => {
        const doctor =
          typeof row.doctorId === "object" ? row.doctorId : null;

        return (
          <div>
            <p className="font-medium text-white">
              {doctor
                ? `${doctor.firstName} ${doctor.lastName}`
                : "Not assigned"}
            </p>
            <p className="text-xs text-slate-400">{doctor?.email || ""}</p>
          </div>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <SickCertificateStatusBadge status={value as any} />
      ),
    },
    {
      key: "paymentStatus",
      title: "Payment",
      render: (value) => (
        <SickCertificatePaymentBadge status={value as any} />
      ),
    },
    {
      key: "amount",
      title: "Amount",
      render: (value) => `${currency}${Number(value || 0).toFixed(2)}`,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <AdminSickCertificateDetailsDialog request={row} />
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return requests.slice(start, end);
  }, [requests, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(requests.length / rowsPerPage);

  return (
    <div className="w-full">
      <DataTable<SickCertificateRequest>
        title="Sick Certificates Directory"
        columns={columns}
        data={paginatedData}
        totalRecords={requests.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        loading={loading}
        emptyMessage="No sick certificate requests found."
      />
    </div>
  );
}

export default function AdminSickCertificatesPage() {
  return (
    <AdminSickCertificatesProvider>
      <AdminSickCertificatesPageContent />
    </AdminSickCertificatesProvider>
  );
}