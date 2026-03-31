"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import type { Prescription } from "@/types/prescription";

interface DoctorPrescriptionsResponse {
  success: boolean;
  count?: number;
  prescriptions: Prescription[];
  message?: string;
}

interface DoctorPrescriptionsContextType {
  prescriptions: Prescription[];
  loading: boolean;
  fetchDoctorPrescriptions: () => Promise<void>;
}

const DoctorPrescriptionsContext = createContext<
  DoctorPrescriptionsContextType | undefined
>(undefined);

export const DoctorPrescriptionsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctorPrescriptions = async () => {
    try {
      setLoading(true);

      const { data } = await api.get<DoctorPrescriptionsResponse>(
        "/prescriptions/doctor"
      );

      if (data.success) {
        setPrescriptions(data.prescriptions || []);
      } else {
        setPrescriptions([]);
      }
    } catch (error) {
      console.log("Error fetching doctor prescriptions:", error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorPrescriptionsContext.Provider
      value={{
        prescriptions,
        loading,
        fetchDoctorPrescriptions,
      }}
    >
      {children}
    </DoctorPrescriptionsContext.Provider>
  );
};

export const useDoctorPrescriptions = () => {
  const context = useContext(DoctorPrescriptionsContext);

  if (!context) {
    throw new Error(
      "useDoctorPrescriptions must be used within DoctorPrescriptionsProvider"
    );
  }

  return context;
};