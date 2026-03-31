"use client";

import { useMemo, useState } from "react";
import DataTable from "@/components/common/data-table";
import StatusBadge from "@/components/common/status-badge";
import { usePatients } from "@/features/patients/context/PatientsContext";
import type { Patient } from "@/types/patient";
import type { TableColumn } from "@/types/table";
import { Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddPatientDialog from "@/features/patients/components/add-patient-dialog";
import ConfirmDeleteDialog from "@/components/common/confirm-delete-dialog";
import UpdatePatientDialog from "@/features/patients/components/update-patient-dialog";

export default function PatientsPage() {
  const { patients, loading,deletePatient } = usePatients();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const columns: TableColumn<Patient>[] = [
    {
    key: "profilePic",
    title: "Profile",
    render: (value) => {
      const pic = value as Patient["profilePic"];

      return (
        <div className="flex items-center">
          {pic?.url ? (
            <Image
              src={pic.url}
              alt="profile"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover border border-white/10"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs text-white">
              NA
            </div>
          )}
        </div>
      );
    },
  },

    {
      key: "firstName",
      title: "First Name",
    },
    {
      key: "lastName",
      title: "Last Name",
    },
    {
      key: "email",
      title: "Email",
      render: (value) => (
        <span className="text-slate-300">{String(value || "-")}</span>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (value) => String(value || "-"),
    },
    {
      key: "role",
      title: "Role",
      render: (value) => <StatusBadge label={String(value || "patient")} />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <UpdatePatientDialog patient={row} />
         <ConfirmDeleteDialog
  title="Delete Patient"
  description="Are you sure you want to delete this patient?"
  onConfirm={() => deletePatient(row._id!)}
/>
        </div>
      ),
    },
  ];

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return patients.slice(start, end);
  }, [patients, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(patients.length / rowsPerPage);

  return (
    <div className="w-full">
      <DataTable
        title="Patients Directory"
        columns={columns}
        data={paginatedData}
        totalRecords={patients.length}
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(value) => {
          setRowsPerPage(value);
          setCurrentPage(1);
        }}
        loading={loading}
        emptyMessage="No patients found."
         headerAction={<AddPatientDialog />}
      />
    </div>
  );
}