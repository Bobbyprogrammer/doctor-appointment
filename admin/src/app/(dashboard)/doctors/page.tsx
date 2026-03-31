"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import DataTable from "@/components/common/data-table";
import StatusBadge from "@/components/common/status-badge";
import ConfirmDeleteDialog from "@/components/common/confirm-delete-dialog";
import { useDoctors } from "@/features/doctors/context/DoctorsContext";
import type { Doctor } from "@/types/doctor";
import type { TableColumn } from "@/types/table";
import AddDoctorDialog from "@/features/doctors/components/add-doctor-dialog";
import UpdateDoctorDialog from "@/features/doctors/components/update-doctor-dialog"
import { Button } from "@/components/ui/button";

export default function DoctorsPage() {
  const { doctors, loading, deleteDoctor } = useDoctors();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns: TableColumn<Doctor>[] = [
    {
      key: "profilePic",
      title: "Doctor",
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-white/5">
            {row.profilePic?.url ? (
              <Image
                src={row.profilePic.url}
                alt={`${row.firstName} ${row.lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white">
                {row.firstName?.charAt(0)}
                {row.lastName?.charAt(0)}
              </div>
            )}
          </div>

          <div>
            <p className="font-medium text-white">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
   {
  key: "documents",
  title: "Documents",
  render: (_, row) => {
    const documents = row.doctorProfile?.documents || [];

    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm text-slate-300">
          {documents.length} document{documents.length !== 1 ? "s" : ""}
        </span>

        {documents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {documents.map((doc, index) => (
              <a
  href={doc.url}
  download={doc.name}
  target="_blank"
  rel="noopener noreferrer"
>
  <Button size="sm">Download</Button>
</a>
            ))}
          </div>
        ) : (
          <span className="text-xs text-slate-400">No documents uploaded</span>
        )}
      </div>
    );
  },
},
    {
      key: "specialization",
      title: "Specialization",
      render: (_, row) => row.doctorProfile?.specialization || "-",
    },
    {
      key: "experienceYears",
      title: "Experience",
      render: (_, row) =>
        row.doctorProfile?.experienceYears !== undefined
          ? `${row.doctorProfile.experienceYears} years`
          : "-",
    },
    {
      key: "consultationFee",
      title: "Fee",
      render: (_, row) =>
        row.doctorProfile?.consultationFee !== undefined
          ? `$${row.doctorProfile.consultationFee}`
          : "-",
    },
    {
      key: "status",
      title: "Status",
      render: (_, row) => (
        <StatusBadge label={row.doctorProfile?.status || "approved"} />
      ),
    },
    {
      key: "isActive",
      title: "Account",
      render: (_, row) => (
        <span className="text-sm font-medium text-white">
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <UpdateDoctorDialog doctor={row} />
          <ConfirmDeleteDialog
            title="Delete Doctor"
            description="Are you sure you want to delete this doctor?"
            onConfirm={() => deleteDoctor(row._id || row.id || "")}
          />
        </div>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return doctors.slice(start, end);
  }, [doctors, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(doctors.length / rowsPerPage);

  return (
    <div className="w-full">
      <DataTable<Doctor>
        title="Doctors Directory"
        columns={columns}
        data={paginatedData}
        totalRecords={doctors.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        loading={loading}
        emptyMessage="No doctors found."
        headerAction={<AddDoctorDialog />}
      />
    </div>
  );
}