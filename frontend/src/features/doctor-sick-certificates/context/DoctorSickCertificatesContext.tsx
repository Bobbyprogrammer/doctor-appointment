"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type { SickCertificateRequest } from "@/types/sick-certificate";

interface DoctorContextType {
  requests: SickCertificateRequest[];
  loading: boolean;

  fetchRequests: () => Promise<void>;

  updateStatus: (
    id: string,
    status: string
  ) => Promise<{ success: boolean; message: string }>;

  generatePdf: (id: string) => Promise<void>;
  sendToPatient: (id: string) => Promise<void>;
}

const DoctorSickCertificatesContext = createContext<
  DoctorContextType | undefined
>(undefined);

export const DoctorSickCertificatesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [requests, setRequests] = useState<SickCertificateRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/sick-certificates/doctor");

      if (data.success) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error(error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { data } = await api.patch(
        `/sick-certificates/doctor/${id}/status`,
        { status }
      );

      if (data.success) {
        await fetchRequests();
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message };
    } catch (error: any) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed",
      };
    }
  };

  const generatePdf = async (id: string) => {
    await api.post(`/sick-certificates/doctor/${id}/generate-pdf`);
    await fetchRequests();
  };

  const sendToPatient = async (id: string) => {
    await api.post(`/sick-certificates/doctor/${id}/send-patient`);
    await fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <DoctorSickCertificatesContext.Provider
      value={{
        requests,
        loading,
        fetchRequests,
        updateStatus,
        generatePdf,
        sendToPatient,
      }}
    >
      {children}
    </DoctorSickCertificatesContext.Provider>
  );
};

export const useDoctorSickCertificates = () => {
  const context = useContext(DoctorSickCertificatesContext);

  if (!context) {
    throw new Error("Must be used inside provider");
  }

  return context;
};