"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/common/data-table";
import ConsultationStatusBadge from "@/components/common/consultation-status-badge";
import PaymentStatusBadge from "@/components/common/payment-status-badge";
import ConsultationDetailsDialog from "@/features/consultations/components/consultation-details-dialog";
import { useConsultations } from "@/features/consultations/context/ConsultationsContext";
import type { Consultation } from "@/types/consultation";
import type { TableColumn } from "@/types/table";

export default function ConsultationsPage() {
  const { consultations, loading } = useConsultations();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns: TableColumn<Consultation>[] = [
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
                : "N/A"}
            </p>
            <p className="text-xs text-slate-400">{patient?.email || ""}</p>
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
      key: "serviceId",
      title: "Service",
      render: (_, row) => {
        const service =
          typeof row.serviceId === "object" ? row.serviceId : null;

        return (
          <div>
            <p className="font-medium text-white">{service?.name || "N/A"}</p>
            <p className="text-xs text-slate-400">
              {service?.durationMinutes || 0} min
            </p>
          </div>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      render: (value) => (
        <ConsultationStatusBadge status={String(value)} />
      ),
    },
    {
      key: "paymentStatus",
      title: "Payment",
      render: (value) => <PaymentStatusBadge status={String(value)} />,
    },
    {
      key: "amount",
      title: "Amount",
      render: (value) => `$${Number(value || 0).toFixed(2)}`,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <ConsultationDetailsDialog consultation={row} />
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return consultations.slice(start, end);
  }, [consultations, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(consultations.length / rowsPerPage);

  return (
    <div className="w-full">
      <DataTable<Consultation>
        title="Consultations Directory"
        columns={columns}
        data={paginatedData}
        totalRecords={consultations.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        loading={loading}
        emptyMessage="No consultations found."
      />
    </div>
  );
}