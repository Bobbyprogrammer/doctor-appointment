"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type { Consultation } from "@/types/consultation";

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

  const fetchAssignedConsultations = async () => {
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

  return (
    <DoctorConsultationsContext.Provider
      value={{
        consultations,
        loading,
        fetchAssignedConsultations,
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