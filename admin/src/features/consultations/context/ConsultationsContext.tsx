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
  Consultation,
  ConsultationsContextType,
  GetConsultationsResponse,
} from "@/types/consultation";

const ConsultationsContext = createContext<ConsultationsContextType | undefined>(
  undefined
);

interface ConsultationsProviderProps {
  children: ReactNode;
}

export const ConsultationsProvider = ({
  children,
}: ConsultationsProviderProps) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdminConsultations = async (): Promise<void> => {
    try {
      setLoading(true);

      const { data } = await api.get<GetConsultationsResponse>(
        "/consultations/admin"
      );

      if (data.success) {
        setConsultations(data.consultations || []);
      } else {
        setConsultations([]);
      }
    } catch (error) {
      console.error("Error fetching consultations:", error);
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminConsultations();
  }, []);

  return (
    <ConsultationsContext.Provider
      value={{
        consultations,
        loading,
        fetchAdminConsultations,
      }}
    >
      {children}
    </ConsultationsContext.Provider>
  );
};

export const useConsultations = (): ConsultationsContextType => {
  const context = useContext(ConsultationsContext);

  if (!context) {
    throw new Error(
      "useConsultations must be used within a ConsultationsProvider"
    );
  }

  return context;
};