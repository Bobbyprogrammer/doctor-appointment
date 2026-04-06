"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type {
  SickCertificateRequest,
  GetAdminSickCertificatesResponse,
  AssignableDoctor,
  GetAssignableDoctorsResponse,
  AssignDoctorResponse,
} from "@/types/sick-certificate";

interface AdminSickCertificatesContextType {
  requests: SickCertificateRequest[];
  loading: boolean;

  doctors: AssignableDoctor[];
  doctorsLoading: boolean;

  fetchAdminRequests: () => Promise<void>;
  fetchAssignableDoctors: () => Promise<void>;

  assignDoctorToRequest: (
    requestId: string,
    doctorId: string
  ) => Promise<{ success: boolean; message: string }>;
}

const AdminSickCertificatesContext = createContext<
  AdminSickCertificatesContextType | undefined
>(undefined);

export const AdminSickCertificatesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [requests, setRequests] = useState<SickCertificateRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const [doctors, setDoctors] = useState<AssignableDoctor[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  const fetchAdminRequests = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<GetAdminSickCertificatesResponse>(
        "/sick-certificates/admin"
      );

      if (data.success) {
        setRequests(data.requests || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Error fetching sick certificate requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignableDoctors = async (): Promise<void> => {
    try {
      setDoctorsLoading(true);

      const { data } = await api.get<GetAssignableDoctorsResponse>("/doctors");

      if (data.success) {
        setDoctors(data.doctors || []);
      } else {
        setDoctors([]);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const assignDoctorToRequest = async (
    requestId: string,
    doctorId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.patch<AssignDoctorResponse>(
        `/sick-certificates/admin/${requestId}/assign-doctor`,
        { doctorId }
      );

      if (data.success) {
        await fetchAdminRequests();
        return {
          success: true,
          message: data.message || "Doctor assigned successfully",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to assign doctor",
      };
    } catch (error: any) {
      console.error("Error assigning doctor:", error);

      return {
        success: false,
        message:
          error?.response?.data?.message || "Failed to assign doctor",
      };
    }
  };

  useEffect(() => {
    fetchAdminRequests();
    fetchAssignableDoctors();
  }, []);

  return (
    <AdminSickCertificatesContext.Provider
      value={{
        requests,
        loading,
        doctors,
        doctorsLoading,
        fetchAdminRequests,
        fetchAssignableDoctors,
        assignDoctorToRequest,
      }}
    >
      {children}
    </AdminSickCertificatesContext.Provider>
  );
};

export const useAdminSickCertificates = () => {
  const context = useContext(AdminSickCertificatesContext);

  if (!context) {
    throw new Error(
      "useAdminSickCertificates must be used within AdminSickCertificatesProvider"
    );
  }

  return context;
};