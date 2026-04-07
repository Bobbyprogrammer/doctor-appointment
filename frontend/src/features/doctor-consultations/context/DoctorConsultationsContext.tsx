"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type { Consultation, ConsultationStatus } from "@/types/consultation";

interface DoctorConsultationsResponse {
  success: boolean;
  count?: number;
  consultations: Consultation[];
  message?: string;
}

interface DoctorConsultationsContextType {
  consultations: Consultation[];
  loading: boolean;
  fetchAssignedConsultations: () => Promise<void>;
  updateConsultationStatus: (
    consultationId: string,
    status: ConsultationStatus,
    note?: string
  ) => Promise<{ success: boolean; message: string }>;
}

const DoctorConsultationsContext = createContext<
  DoctorConsultationsContextType | undefined
>(undefined);

export const DoctorConsultationsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssignedConsultations = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<DoctorConsultationsResponse>(
        "/consultations/doctor/assigned"
      );

      if (data.success) {
        setConsultations(data.consultations || []);
      } else {
        setConsultations([]);
      }
    } catch (error) {
      console.log("Error fetching doctor consultations:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (
    consultationId: string,
    status: ConsultationStatus,
    note = ""
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.patch(
        `/consultations/doctor/${consultationId}/status`,
        {
          status,
          note,
        }
      );

      if (data.success) {
        await fetchAssignedConsultations();
        return {
          success: true,
          message: data.message || "Status updated successfully",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to update consultation status",
      };
    } catch (error: any) {
      console.error("Error updating consultation status:", error);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          "Failed to update consultation status",
      };
    }
  };

  return (
    <DoctorConsultationsContext.Provider
      value={{
        consultations,
        loading,
        fetchAssignedConsultations,
        updateConsultationStatus,
      }}
    >
      {children}
    </DoctorConsultationsContext.Provider>
  );
};

export const useDoctorConsultations = () => {
  const context = useContext(DoctorConsultationsContext);

  if (!context) {
    throw new Error(
      "useDoctorConsultations must be used within DoctorConsultationsProvider"
    );
  }

  return context;
};